"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminRejectFeature } from "@/lib/db/admin-actions";
import { FeatureStatus } from "@/lib/types";
import type { FeatureWithAuthor } from "@/lib/types";
import { ProductTagBadge } from "@/components/product-tag-badge";
import { StatusBadge } from "@/components/status-badge";
import { ApproveModal } from "@/components/admin/approve-modal";
import { StatusUpdateDropdown } from "@/components/admin/status-update-dropdown";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ModerationQueueProps {
  pendingFeatures: FeatureWithAuthor[];
  activeFeatures: FeatureWithAuthor[];
}

function RejectButton({ featureId }: { featureId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleReject() {
    if (!confirm("Reject this feature request?")) return;
    setLoading(true);
    const result = await adminRejectFeature({ featureId });
    if (!result.success) {
      toast.error(result.error);
    } else {
      toast.success("Feature rejected");
    }
    setLoading(false);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReject}
      disabled={loading}
      className="text-red-400 border-red-400/30 hover:bg-red-400/10"
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Reject"}
    </Button>
  );
}

export function ModerationQueue({ pendingFeatures, activeFeatures }: ModerationQueueProps) {
  return (
    <div className="space-y-8">
      {/* Pending Queue */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">
          Pending Review ({pendingFeatures.length})
        </h2>
        {pendingFeatures.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No features pending review.</p>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingFeatures.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                      {f.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{f.author.email}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {f.author.companyName ?? "—"}
                    </TableCell>
                    <TableCell>
                      <ProductTagBadge tag={f.productTag} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(f.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ApproveModal featureId={f.id} featureTitle={f.title} />
                        <RejectButton featureId={f.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Active Features (COMMITTED / IN_PROGRESS) */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">
          Active Features ({activeFeatures.length})
        </h2>
        {activeFeatures.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No active features to update.</p>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Funding</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeFeatures.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                      {f.title}
                    </TableCell>
                    <TableCell>
                      <ProductTagBadge tag={f.productTag} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={f.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {f.caratCost != null
                        ? `${f.totalFunded} / ${f.caratCost} Carats`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusUpdateDropdown
                        featureId={f.id}
                        currentStatus={f.status as FeatureStatus}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
