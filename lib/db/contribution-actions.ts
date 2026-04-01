"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { FeatureStatus } from "@/lib/types";
import { getSessionUser } from "@/lib/auth";
import { contributeSchema } from "@/lib/validations/contribution";
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
  if (user.currentBalance < amount) {
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

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { currentBalance: { decrement: amount } },
    }),
    prisma.featureRequest.update({
      where: { id: featureId },
      data: {
        totalFunded: { increment: amount },
        ...(willBeCommitted ? { status: FeatureStatus.COMMITTED } : {}),
      },
    }),
    prisma.contribution.create({
      data: { userId: user.id, featureId, amount },
    }),
  ]);

  revalidatePath(`/dashboard/features/${featureId}`);
  revalidatePath("/dashboard");
  return { success: true };
}
