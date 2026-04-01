"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminApproveFeature } from "@/lib/db/admin-actions";
import { currency } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface ApproveModalProps {
  featureId: string;
  featureTitle: string;
}

export function ApproveModal({ featureId, featureTitle }: ApproveModalProps) {
  const [open, setOpen] = useState(false);
  const [caratCost, setCaratCost] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    const cost = parseInt(caratCost, 10);
    if (isNaN(cost) || cost < 1) {
      toast.error(`Please enter a valid ${currency.singular.toLowerCase()} cost (minimum 1)`);
      return;
    }

    setLoading(true);
    const result = await adminApproveFeature({ featureId, caratCost: cost });

    if (!result.success) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success("Feature approved and opened for funding");
    setOpen(false);
    setCaratCost("");
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="text-emerald-400 border-emerald-400/30 hover:bg-emerald-400/10">
            Approve
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve Feature</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{featureTitle}</p>
          <div className="space-y-2">
            <Label htmlFor="caratCost">{currency.singular} Cost</Label>
            <Input
              id="caratCost"
              type="number"
              min={1}
              placeholder="e.g. 10"
              value={caratCost}
              onChange={(e) => setCaratCost(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {`How many ${currency.plural} must be crowdfunded to commit this feature?`}
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={handleApprove} disabled={loading || !caratCost}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
