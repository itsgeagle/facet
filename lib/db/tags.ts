"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth";
import { Role } from "@/lib/types";
import { createTagSchema, updateTagSchema } from "@/lib/validations/tags";
import type { ProductTag, ActionResult } from "@/lib/types";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== Role.ADMIN) return null;
  return user;
}

export async function getProductTags(): Promise<ProductTag[]> {
  return prisma.productTag.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAllProductTagsAdmin(): Promise<ProductTag[]> {
  return prisma.productTag.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function createProductTag(data: unknown): Promise<ActionResult<ProductTag>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  const parsed = createTagSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { label, value, color, description, isActive } = parsed.data;

  const existing = await prisma.productTag.findUnique({ where: { value } });
  if (existing) return { success: false, error: "A tag with that value already exists" };

  const agg = await prisma.productTag.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (agg._max.sortOrder ?? -1) + 1;

  const tag = await prisma.productTag.create({
    data: { label, value, color, description: description ?? null, isActive, sortOrder },
  });

  revalidatePath("/admin");
  return { success: true, data: tag };
}

export async function updateProductTag(id: string, data: unknown): Promise<ActionResult<ProductTag>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  const parsed = updateTagSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { label, value, color, description, isActive } = parsed.data;

  const conflict = await prisma.productTag.findFirst({ where: { value, NOT: { id } } });
  if (conflict) return { success: false, error: "A tag with that value already exists" };

  const tag = await prisma.productTag.update({
    where: { id },
    data: { label, value, color, description: description ?? null, isActive },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true, data: tag };
}

export async function deleteProductTag(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  const featureCount = await prisma.featureRequest.count({ where: { productTagId: id } });
  if (featureCount > 0) {
    return { success: false, error: "Cannot delete a tag that has associated features" };
  }

  await prisma.productTag.delete({ where: { id } });
  revalidatePath("/admin");
  return { success: true };
}

export async function updateTagSortOrder(orderedIds: string[]): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.productTag.update({ where: { id }, data: { sortOrder: index } })
    )
  );

  revalidatePath("/admin");
  return { success: true };
}
