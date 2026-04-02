import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getFeatureById } from "@/lib/db/features";
import { getTotalPurchasedBalance } from "@/lib/db/purchase-actions";
import { FeatureStatus } from "@/lib/types";
import { ProductTagBadge } from "@/components/product-tag-badge";
import { StatusBadge } from "@/components/status-badge";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { ContributeModal } from "@/components/contribute-modal";
import { ContributorList } from "@/components/contributor-list";
import { XCircle } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { currency, unitLabel } from "@/lib/brand";

interface FeatureDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function FeatureDetailPage({ params }: FeatureDetailPageProps) {
  const { id } = await params;
  const [user, feature] = await Promise.all([
    getSessionUser(),
    getFeatureById(id),
  ]);

  if (!user) redirect("/login");
  if (!feature) notFound();

  const totalPurchasedBalance = await getTotalPurchasedBalance(user.id);
  const totalBalance = user.currentBalance + totalPurchasedBalance;

  const fundingPercent =
    feature.caratCost && feature.caratCost > 0
      ? Math.min(100, Math.round((feature.totalFunded / feature.caratCost) * 100))
      : 0;

  const remainingNeeded = feature.caratCost
    ? Math.max(0, feature.caratCost - feature.totalFunded)
    : 0;

  const canContribute =
    feature.status === FeatureStatus.OPEN &&
    feature.authorId !== user.id &&
    totalBalance > 0 &&
    remainingNeeded > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <ProductTagBadge tag={feature.productTag} />
          <StatusBadge status={feature.status} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{feature.title}</h1>
        <p className="text-sm text-muted-foreground">
          Submitted by{" "}
          <span className="text-foreground">
            {feature.author.companyName ?? feature.author.email}
          </span>{" "}
          on{" "}
          {new Date(feature.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Rejection notice */}
      {feature.status === FeatureStatus.REJECTED && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 flex gap-3">
          <XCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-red-400">Feature rejected</p>
            {feature.rejectionReason ? (
              <p className="text-sm text-muted-foreground">{feature.rejectionReason}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No reason provided.</p>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="rounded-lg border border-border bg-card p-6">
        <TiptapRenderer content={feature.description} />
      </div>

      {/* Funding */}
      {feature.caratCost != null && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <BrandIcon className="h-4 w-4 text-primary" />
              Funding Progress
            </h2>
            <span className="text-sm font-medium text-foreground">
              {feature.totalFunded}{" "}
              <span className="text-muted-foreground">/ {feature.caratCost} {currency.plural}</span>
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${fundingPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {fundingPercent}% funded
            {remainingNeeded > 0 && ` — ${remainingNeeded} ${unitLabel(remainingNeeded)} needed`}
          </p>

          {canContribute && (
            <ContributeModal
              featureId={feature.id}
              featureTitle={feature.title}
              userBalance={totalBalance}
              remainingNeeded={remainingNeeded}
            />
          )}

          {feature.status === FeatureStatus.OPEN && feature.authorId === user.id && (
            <p className="text-xs text-muted-foreground italic">
              You cannot contribute to your own feature.
            </p>
          )}
        </div>
      )}

      {/* Contributors */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h2 className="font-semibold text-foreground">
          Contributors ({feature.contributions.length})
        </h2>
        <ContributorList contributions={feature.contributions} />
      </div>
    </div>
  );
}
