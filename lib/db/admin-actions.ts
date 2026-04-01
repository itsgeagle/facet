"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { FeatureStatus, Role } from "@/lib/types";
import { getSessionUser } from "@/lib/auth";
import {
  approveFeatureSchema,
  rejectFeatureSchema,
  updateFeatureStatusSchema,
} from "@/lib/validations/admin";
import type { ActionResult } from "@/lib/types";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== Role.ADMIN) return null;
  return user;
}

export async function adminApproveFeature(data: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  const parsed = approveFeatureSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const feature = await prisma.featureRequest.findUnique({
    where: { id: parsed.data.featureId },
  });
  if (!feature) return { success: false, error: "Feature not found" };
  if (feature.status !== FeatureStatus.PENDING) {
    return { success: false, error: "Feature is not pending" };
  }

  await prisma.featureRequest.update({
    where: { id: parsed.data.featureId },
    data: { status: FeatureStatus.OPEN, caratCost: parsed.data.caratCost },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function adminRejectFeature(data: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  const parsed = rejectFeatureSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const feature = await prisma.featureRequest.findUnique({
    where: { id: parsed.data.featureId },
  });
  if (!feature) return { success: false, error: "Feature not found" };
  if (feature.status !== FeatureStatus.PENDING) {
    return { success: false, error: "Feature is not pending" };
  }

  await prisma.featureRequest.update({
    where: { id: parsed.data.featureId },
    data: {
      status: FeatureStatus.REJECTED,
      rejectionReason: parsed.data.reason ?? null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function adminUpdateFeatureStatus(data: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  const parsed = updateFeatureStatusSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const feature = await prisma.featureRequest.findUnique({
    where: { id: parsed.data.featureId },
  });
  if (!feature) return { success: false, error: "Feature not found" };

  const validTransitions: Record<string, FeatureStatus[]> = {
    [FeatureStatus.COMMITTED]: [FeatureStatus.IN_PROGRESS],
    [FeatureStatus.IN_PROGRESS]: [FeatureStatus.SHIPPED],
  };

  const allowed = validTransitions[feature.status] ?? [];
  if (!allowed.includes(parsed.data.status)) {
    return {
      success: false,
      error: `Cannot transition from ${feature.status} to ${parsed.data.status}`,
    };
  }

  await prisma.featureRequest.update({
    where: { id: parsed.data.featureId },
    data: { status: parsed.data.status },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}
