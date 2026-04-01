import { Trophy } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import type { LeaderboardEntry } from "@/lib/db/analytics";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const RANK_STYLES = [
  "text-yellow-400",
  "text-slate-300",
  "text-amber-600",
];

export function Leaderboard({ entries }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted">
          <Trophy className="h-7 w-7 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">No contributions yet.</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            The leaderboard will populate once users start funding features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => {
        const rank = index + 1;
        const rankColor = RANK_STYLES[index] ?? "text-muted-foreground";
        const displayName = entry.companyName ?? entry.email;

        return (
          <div
            key={entry.userId}
            className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3"
          >
            <span className={`w-6 text-center text-sm font-bold ${rankColor}`}>
              {rank}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              {entry.companyName && (
                <p className="text-xs text-muted-foreground truncate">{entry.email}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-primary shrink-0">
              <BrandIcon className="h-3.5 w-3.5" />
              {entry.totalCarats}
              <span className="text-xs font-normal text-muted-foreground">
                ({entry.contributionCount} contribution{entry.contributionCount !== 1 ? "s" : ""})
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
