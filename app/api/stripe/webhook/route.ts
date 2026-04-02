import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db/prisma";
import config from "@/config/whitelabel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const packageId = session.metadata?.packageId;

    if (!userId || !packageId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const pkg = config.store?.packages.find((p) => p.id === packageId);
    if (!pkg) {
      // Unknown package — return 200 so Stripe doesn't retry
      return NextResponse.json({ received: true });
    }

    const purchase = await prisma.creditPurchase.findUnique({
      where: { stripeSessionId: session.id },
    });

    // Idempotency guard — skip if already fulfilled
    if (!purchase || purchase.status === "COMPLETED") {
      return NextResponse.json({ received: true });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    await prisma.creditPurchase.update({
      where: { stripeSessionId: session.id },
      data: {
        status: "COMPLETED",
        remainingCredits: pkg.credits,
        expiresAt,
      },
    });
  }

  return NextResponse.json({ received: true });
}
