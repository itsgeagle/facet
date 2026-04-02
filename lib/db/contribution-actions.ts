"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { FeatureStatus } from "@/lib/types";
import { getSessionUser } from "@/lib/auth";
import { contributeSchema } from "@/lib/validations/contribution";
import { getActivePurchasedCredits } from "@/lib/db/purchase-actions";
import type { ActionResult } from "@/lib/types";

export async function contributeCarats(data: unknown): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const parsed = contributeSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { featureId, amount } = parsed.data;

  const feature = await prisma.featureRequest.findUnique({
    where: { id: featureId },
  });

  if (!feature) return { success: false, error: "Feature not found" };
  if (feature.status !== FeatureStatus.OPEN) {
    return { success: false, error: "Feature is not open for contributions" };
  }

  const activePurchases = await getActivePurchasedCredits(user.id);
  const totalPurchased = activePurchases.reduce((s, p) => s + (p.remainingCredits ?? 0), 0);
  const totalSpendable = user.currentBalance + totalPurchased;

  if (totalSpendable < amount) {
    return { success: false, error: "Insufficient carat balance" };
  }

  const remaining = (feature.caratCost ?? 0) - feature.totalFunded;
  if (amount > remaining) {
    return {
      success: false,
      error: `You can contribute at most ${remaining} Carats to fully fund this feature`,
    };
  }

  const newTotalFunded = feature.totalFunded + amount;
  const willBeCommitted =
    feature.caratCost != null && newTotalFunded >= feature.caratCost;

  // Build deduction plan: monthly first, then earliest-expiring purchased buckets
  let remainingToDeduct = amount;
  const monthlyDeduction = Math.min(remainingToDeduct, user.currentBalance);
  remainingToDeduct -= monthlyDeduction;

  const purchaseDeductions: { id: string; decrement: number }[] = [];
  for (const bucket of activePurchases) {
    if (remainingToDeduct <= 0) break;
    const take = Math.min(remainingToDeduct, bucket.remainingCredits ?? 0);
    if (take > 0) {
      purchaseDeductions.push({ id: bucket.id, decrement: take });
      remainingToDeduct -= take;
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { currentBalance: { decrement: monthlyDeduction } },
    });
    await tx.featureRequest.update({
      where: { id: featureId },
      data: {
        totalFunded: { increment: amount },
        ...(willBeCommitted ? { status: FeatureStatus.COMMITTED } : {}),
      },
    });
    await tx.contribution.create({
      data: { userId: user.id, featureId, amount },
    });
    for (const d of purchaseDeductions) {
      await tx.creditPurchase.update({
        where: { id: d.id },
        data: { remainingCredits: { decrement: d.decrement } },
      });
    }
  });

  revalidatePath(`/dashboard/features/${featureId}`);
  revalidatePath("/dashboard");
  return { success: true };
}
