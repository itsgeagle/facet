import { CheckCircle } from "lucide-react";
import { getPurchaseBySessionId } from "@/lib/db/purchase-actions";
import { unitLabel } from "@/lib/brand";
import { LinkButton } from "@/components/link-button";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function PurchaseSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  const purchase = session_id
    ? await getPurchaseBySessionId(session_id)
    : null;

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Payment successful!</h1>
        {purchase ? (
          <p className="text-muted-foreground">
            {purchase.creditsGranted} {unitLabel(purchase.creditsGranted)} have been added to your balance.
          </p>
        ) : (
          <p className="text-muted-foreground">
            Your credits have been added to your balance.
          </p>
        )}
      </div>
      <LinkButton href="/dashboard">Back to Dashboard</LinkButton>
    </div>
  );
}
