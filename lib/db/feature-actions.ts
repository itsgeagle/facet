"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth";
import { submitFeatureSchema } from "@/lib/validations/feature";
import type { ActionResult } from "@/lib/types";

export async function submitFeature(data: unknown): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const parsed = submitFeatureSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.featureRequest.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      productTag: parsed.data.productTag,
      authorId: user.id,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}
