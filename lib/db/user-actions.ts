"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { Role } from "@/lib/types";
import { getSessionUser } from "@/lib/auth";
import { createUserSchema, updateAllowanceSchema, setPasswordSchema } from "@/lib/validations/user";
import type { ActionResult } from "@/lib/types";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== Role.ADMIN) return null;
  return user;
}

export async function createUser(data: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  const parsed = createUserSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email, password, companyName, monthlyAllowance } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "A user with that email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      role: Role.USER,
      companyName: companyName ?? null,
      monthlyAllowance,
      currentBalance: monthlyAllowance,
      passwordHash,
    },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function resetUserPassword(data: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  const parsed = setPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { userId, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "User not found" };

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { success: true };
}

export async function updateUserAllowance(data: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  const parsed = updateAllowanceSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { monthlyAllowance: parsed.data.monthlyAllowance },
  });

  revalidatePath("/admin");
  return { success: true };
}
