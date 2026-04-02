import { XCircle } from "lucide-react";
import { markPurchaseFailed } from "@/lib/db/purchase-actions";
import { LinkButton } from "@/components/link-button";

interface CancelPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function PurchaseCancelPage({ searchParams }: CancelPageProps) {
  const { session_id } = await searchParams;
  if (session_id) await markPurchaseFailed(session_id);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <XCircle className="h-16 w-16 text-muted-foreground" />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Purchase cancelled</h1>
        <p className="text-muted-foreground">
          Your payment was not processed. No charges were made.
        </p>
      </div>
      <LinkButton href="/dashboard" variant="outline">Back to Dashboard</LinkButton>
    </div>
  );
}
