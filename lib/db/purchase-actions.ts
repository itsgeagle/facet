"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth";
import { createCheckoutSchema } from "@/lib/validations/purchase";
import config from "@/config/whitelabel";
import { currency } from "@/lib/brand";
import type { ActionResult, BalanceBreakdown, CreditPurchase, PurchasedCreditBucket } from "@/lib/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(
  data: unknown
): Promise<ActionResult<{ url: string }>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const parsed = createCheckoutSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { packageId } = parsed.data;

  if (!config.store?.enabled) {
    return { success: false, error: "Store is disabled" };
  }

  const pkg = config.store.packages.find((p) => p.id === packageId);
  if (!pkg) return { success: false, error: "Package not found" };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: pkg.priceUsd * 100,
          product_data: {
            name: `${pkg.credits} ${pkg.credits === 1 ? currency.singular : currency.plural}`,
            description: pkg.description,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: user.id,
      packageId: pkg.id,
    },
    success_url: `${process.env.AUTH_URL}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.AUTH_URL}/purchase/cancel?session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.url) {
    return { success: false, error: "Failed to create checkout session" };
  }

  await prisma.creditPurchase.create({
    data: {
      userId: user.id,
      packageId: pkg.id,
      creditsGranted: pkg.credits,
      amountCents: pkg.priceUsd * 100,
      stripeSessionId: session.id,
      status: "PENDING",
    },
  });

  return { success: true, data: { url: session.url } };
}

export async function getPurchaseBySessionId(
  sessionId: string
): Promise<CreditPurchase | null> {
  return prisma.creditPurchase.findUnique({
    where: { stripeSessionId: sessionId },
  });
}

export async function markPurchaseFailed(sessionId: string): Promise<void> {
  await prisma.creditPurchase.updateMany({
    where: { stripeSessionId: sessionId, status: "PENDING" },
    data: { status: "FAILED" },
  });
}

export async function getActivePurchasedCredits(userId: string): Promise<CreditPurchase[]> {
  const now = new Date();
  return prisma.creditPurchase.findMany({
    where: {
      userId,
      status: "COMPLETED",
      expiresAt: { gt: now },
      remainingCredits: { gt: 0 },
    },
    orderBy: { expiresAt: "asc" },
  });
}

export async function getTotalPurchasedBalance(userId: string): Promise<number> {
  const now = new Date();
  const result = await prisma.creditPurchase.aggregate({
    where: {
      userId,
      status: "COMPLETED",
      expiresAt: { gt: now },
      remainingCredits: { gt: 0 },
    },
    _sum: { remainingCredits: true },
  });
  return result._sum.remainingCredits ?? 0;
}

export async function getBalanceBreakdown(userId: string): Promise<BalanceBreakdown> {
  const now = new Date();
  const nextResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [user, activePurchases] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { currentBalance: true, monthlyAllowance: true },
    }),
    getActivePurchasedCredits(userId),
  ]);

  const purchasedBuckets: PurchasedCreditBucket[] = activePurchases.map((p) => ({
    id: p.id,
    creditsGranted: p.creditsGranted,
    remainingCredits: p.remainingCredits!,
    expiresAt: p.expiresAt!,
    purchasedAt: p.createdAt,
  }));

  const totalPurchased = purchasedBuckets.reduce((sum, b) => sum + b.remainingCredits, 0);

  return {
    monthlyBalance: user.currentBalance,
    monthlyAllowance: user.monthlyAllowance,
    nextResetDate,
    purchasedBuckets,
    totalBalance: user.currentBalance + totalPurchased,
  };
}
