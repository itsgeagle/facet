"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Gem } from "lucide-react";
import { toast } from "sonner";
import { contributeCarats } from "@/lib/db/contribution-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface ContributeModalProps {
  featureId: string;
  featureTitle: string;
  userBalance: number;
  remainingNeeded: number;
}

export function ContributeModal({
  featureId,
  featureTitle,
  userBalance,
  remainingNeeded,
}: ContributeModalProps) {
  const router = useRouter();
  const maxAmount = Math.min(userBalance, remainingNeeded);
  const [amount, setAmount] = useState(Math.max(1, Math.min(1, maxAmount)));
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSliderChange(value: number | readonly number[]) {
    const val = Array.isArray(value) ? (value as readonly number[])[0] : (value as number);
    if (val !== undefined) setAmount(val);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Math.max(1, Math.min(maxAmount, Number(e.target.value)));
    setAmount(val);
  }

  async function handleContribute() {
    setLoading(true);

    const result = await contributeCarats({ featureId, amount });

    if (!result.success) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success(`Contributed ${amount} ${amount === 1 ? "Carat" : "Carats"} successfully!`);
    setOpen(false);
    router.refresh();
    setLoading(false);
  }

  if (maxAmount < 1) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="flex items-center gap-2">
            <Gem className="h-4 w-4" />
            Contribute Carats
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contribute Carats</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{featureTitle}</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Amount</Label>
              <span className="text-xs text-muted-foreground">
                Balance after: {userBalance - amount} Carats
              </span>
            </div>

            <Slider
              min={1}
              max={maxAmount}
              value={[amount]}
              onValueChange={handleSliderChange}
            />

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={maxAmount}
                value={amount}
                onChange={handleInputChange}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                of {maxAmount} max Carats
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={handleContribute} disabled={loading || amount < 1}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Contributing…
              </>
            ) : (
              `Contribute ${amount} ${amount === 1 ? "Carat" : "Carats"}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
