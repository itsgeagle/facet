"use client";

import { useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { adminUpdateFeatureStatus } from "@/lib/db/admin-actions";
import { FeatureStatus } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StatusUpdateDropdownProps {
  featureId: string;
  currentStatus: FeatureStatus;
}

const NEXT_STATUS: Partial<Record<FeatureStatus, { value: FeatureStatus; label: string }>> = {
  [FeatureStatus.COMMITTED]: { value: FeatureStatus.IN_PROGRESS, label: "Mark In Progress" },
  [FeatureStatus.IN_PROGRESS]: { value: FeatureStatus.SHIPPED, label: "Mark Shipped" },
};

export function StatusUpdateDropdown({ featureId, currentStatus }: StatusUpdateDropdownProps) {
  const [loading, setLoading] = useState(false);
  const next = NEXT_STATUS[currentStatus];

  if (!next) return null;

  async function handleUpdate() {
    if (!next) return;
    setLoading(true);
    const result = await adminUpdateFeatureStatus({ featureId, status: next.value });

    if (!result.success) {
      toast.error(result.error);
    } else {
      toast.success(`Status updated to ${next.label.replace("Mark ", "")}`);
    }
    setLoading(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-border hover:bg-muted transition-colors disabled:opacity-50 outline-none">
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ChevronDown className="h-3 w-3" />}
        Update Status
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleUpdate} disabled={loading} className="cursor-pointer">
          {next.label}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
