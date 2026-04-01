import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProductTagBadge } from "@/components/product-tag-badge";
import { StatusBadge } from "@/components/status-badge";
import { FeatureStatus } from "@/lib/types";
import type { FeatureWithAuthor } from "@/lib/types";

interface FeatureCardProps {
  feature: FeatureWithAuthor;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const showProgress =
    feature.status === FeatureStatus.OPEN ||
    feature.status === FeatureStatus.COMMITTED ||
    feature.status === FeatureStatus.IN_PROGRESS ||
    feature.status === FeatureStatus.SHIPPED;

  const fundingPercent =
    feature.caratCost && feature.caratCost > 0
      ? Math.min(100, Math.round((feature.totalFunded / feature.caratCost) * 100))
      : 0;

  return (
    <Link href={`/dashboard/features/${feature.id}`} className="block group">
      <Card className="h-full bg-card border-border transition-colors group-hover:border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <ProductTagBadge tag={feature.productTag} />
            <StatusBadge status={feature.status} />
          </div>
          <h3 className="font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {feature.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {feature.author.companyName ?? feature.author.email}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          {showProgress && feature.caratCost != null && (
            <div className="space-y-1.5">
              <Progress
                value={fundingPercent}
                className="h-2 bg-muted [&>div]:bg-primary"
              />
              <p className="text-xs text-muted-foreground">
                {feature.totalFunded} / {feature.caratCost} Carats
              </p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(feature.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
