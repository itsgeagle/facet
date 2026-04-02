"use server";

import { getSessionUser } from "@/lib/auth";
import { getBalanceBreakdown } from "@/lib/db/purchase-actions";
import type { ActionResult, BalanceBreakdown } from "@/lib/types";

export async function fetchBalanceBreakdown(): Promise<ActionResult<BalanceBreakdown>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Not authenticated" };
  const breakdown = await getBalanceBreakdown(user.id);
  return { success: true, data: breakdown };
}
