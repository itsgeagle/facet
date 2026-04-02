"use client";

import { useState } from "react";
import { BrandIcon } from "@/components/brand-icon";
import { currency, unitLabel } from "@/lib/brand";
import { fetchBalanceBreakdown } from "@/lib/db/balance-actions";
import type { BalanceBreakdown } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface CaratBalanceDisplayProps {
  currentBalance: number;
  monthlyAllowance: number;
  totalBalance: number;
  userId: string;
}

export function CaratBalanceDisplay({
  totalBalance,
}: CaratBalanceDisplayProps) {
  const [open, setOpen] = useState(false);
  const [breakdown, setBreakdown] = useState<BalanceBreakdown | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleOpen(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen && !breakdown) {
      setLoading(true);
      const result = await fetchBalanceBreakdown();
      if (result.success && result.data) setBreakdown(result.data);
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger
        render={
          <button className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer" />
        }
      >
        <BrandIcon className="h-4 w-4 text-primary" />
        <span>
          <span className="text-primary font-bold">{totalBalance}</span>
          <span className="text-muted-foreground"> {currency.plural}</span>
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Your {currency.plural}</DialogTitle>
        </DialogHeader>

        {loading && (
          <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>
        )}

        {!loading && breakdown && (
          <div className="flex flex-col gap-3 py-1">
            {/* Monthly row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">Monthly allowance</span>
                <span className="text-xs text-muted-foreground">
                  Resets{" "}
                  {breakdown.nextResetDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <span className="text-sm font-semibold shrink-0">
                {breakdown.monthlyBalance}{" "}
                <span className="text-muted-foreground font-normal">
                  / {breakdown.monthlyAllowance}
                </span>
              </span>
            </div>

            {/* Purchased buckets */}
            {breakdown.purchasedBuckets.length > 0 ? (
              <>
                <Separator />
                {breakdown.purchasedBuckets.map((bucket) => (
                  <div key={bucket.id} className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">Purchased</span>
                      <span className="text-xs text-muted-foreground">
                        Expires{" "}
                        {bucket.expiresAt.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <span className="text-sm font-semibold shrink-0">
                      {bucket.remainingCredits}{" "}
                      <span className="text-muted-foreground font-normal">
                        / {bucket.creditsGranted}
                      </span>
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <>
                <Separator />
                <p className="text-xs text-muted-foreground">No purchased credits.</p>
              </>
            )}

            {/* Total */}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-sm font-bold text-primary">
                {breakdown.totalBalance} {unitLabel(breakdown.totalBalance)}
              </span>
            </div>
          </div>
        )}

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
