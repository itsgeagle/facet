"use client";

import { useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { updateUserAllowance } from "@/lib/db/user-actions";
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

interface EditAllowanceModalProps {
  userId: string;
  currentAllowance: number;
  userEmail: string;
}

export function EditAllowanceModal({
  userId,
  currentAllowance,
  userEmail,
}: EditAllowanceModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allowance, setAllowance] = useState(String(currentAllowance));

  async function handleSave() {
    const val = parseInt(allowance, 10);
    if (isNaN(val) || val < 0) {
      toast.error("Please enter a valid allowance (0 or more)");
      return;
    }

    setLoading(true);
    const result = await updateUserAllowance({ userId, monthlyAllowance: val });

    if (!result.success) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success("Allowance updated");
    setOpen(false);
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Pencil className="h-3 w-3" />
            Edit
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Monthly Allowance</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
          <div className="space-y-2">
            <Label htmlFor="allowance">{`Monthly Allowance (${currency.plural})`}</Label>
            <Input
              id="allowance"
              type="number"
              min={0}
              value={allowance}
              onChange={(e) => setAllowance(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
