"use client";

import { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { storeConfig, currency } from "@/lib/brand";
import { createCheckoutSession } from "@/lib/db/purchase-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function BuyCreditsModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  if (!storeConfig?.enabled || !storeConfig.packages.length) return null;

  async function handleBuy(packageId: string) {
    setLoading(packageId);
    try {
      const result = await createCheckoutSession({ packageId });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      window.location.href = result.data!.url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5" />
        }
      >
        <ShoppingCart className="h-3.5 w-3.5" />
        Buy
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy {currency.plural}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          {storeConfig.packages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-sm">{pkg.label}</span>
                <span className="text-xs text-muted-foreground">
                  {pkg.credits} {pkg.credits === 1 ? currency.singular : currency.plural}
                  {pkg.description ? ` — ${pkg.description}` : ""}
                </span>
              </div>
              <Button
                size="sm"
                onClick={() => handleBuy(pkg.id)}
                disabled={loading !== null}
                className="ml-4 shrink-0"
              >
                {loading === pkg.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  `$${pkg.priceUsd}`
                )}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
