"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { Role } from "@/lib/types";
import { getSessionUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createUserSchema, updateAllowanceSchema } from "@/lib/validations/user";
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

  const supabaseAdmin = createSupabaseAdminClient();
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: Role.USER },
  });

  if (authError) {
    return { success: false, error: authError.message };
  }

  if (!authData.user) {
    return { success: false, error: "Failed to create auth user" };
  }

  try {
    await prisma.user.create({
      data: {
        email,
        role: Role.USER,
        companyName: companyName ?? null,
        monthlyAllowance,
        currentBalance: monthlyAllowance,
      },
    });
  } catch (err) {
    // Roll back Supabase user if DB creation fails
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    const message = err instanceof Error ? err.message : "Database error";
    return { success: false, error: message };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function resetUserPassword(userId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "User not found" };

  const supabaseAdmin = createSupabaseAdminClient();
  const { error } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email: user.email,
  });

  if (error) {
    return { success: false, error: error.message };
  }

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
