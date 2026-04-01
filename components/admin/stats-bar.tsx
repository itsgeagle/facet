import { Users, LayoutList, TrendingUp } from "lucide-react";
import type { AdminStats } from "@/lib/db/analytics";
import { FeatureStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/constants";
import { BrandLucideIcon, currency } from "@/lib/brand";

interface StatsBarProps {
  stats: AdminStats;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 flex items-start gap-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

export function StatsBar({ stats }: StatsBarProps) {
  const openCount = stats.featureCountByStatus[FeatureStatus.OPEN] ?? 0;
  const pendingCount = stats.featureCountByStatus[FeatureStatus.PENDING] ?? 0;
  const committedCount =
    (stats.featureCountByStatus[FeatureStatus.COMMITTED] ?? 0) +
    (stats.featureCountByStatus[FeatureStatus.IN_PROGRESS] ?? 0);
  const shippedCount = stats.featureCountByStatus[FeatureStatus.SHIPPED] ?? 0;

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={LayoutList}
          label="Total Features"
          value={stats.totalFeatures}
          sub={`${pendingCount} pending review`}
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
        />
        <StatCard
          icon={BrandLucideIcon}
          label={`${currency.plural} in Circulation`}
          value={stats.totalCaratsInCirculation}
          sub="across all users"
        />
        <StatCard
          icon={TrendingUp}
          label="Funded This Month"
          value={`${stats.totalCaratsFundedThisMonth} ${currency.plural}`}
        />
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {[
          { status: FeatureStatus.OPEN, count: openCount },
          { status: FeatureStatus.COMMITTED, count: committedCount },
          { status: FeatureStatus.SHIPPED, count: shippedCount },
          { status: FeatureStatus.REJECTED, count: stats.featureCountByStatus[FeatureStatus.REJECTED] ?? 0 },
        ].map(({ status, count }) => (
          <span
            key={status}
            className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5"
          >
            <span className="font-medium text-foreground">{count}</span>
            {STATUS_LABELS[status]}
          </span>
        ))}
      </div>
    </div>
  );
}
