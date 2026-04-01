import type { Contribution, User } from "@/lib/types";

type ContributionWithUser = Contribution & {
  user: Pick<User, "id" | "email" | "companyName">;
};

interface ContributorListProps {
  contributions: ContributionWithUser[];
}

export function ContributorList({ contributions }: ContributorListProps) {
  if (contributions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">No contributors yet.</p>
    );
  }

  return (
    <div className="space-y-2">
      {contributions.map((c) => (
        <div
          key={c.id}
          className="flex items-center justify-between py-2 border-b border-border last:border-0"
        >
          <span className="text-sm text-foreground">
            {c.user.companyName ?? c.user.email}
          </span>
          <span className="text-sm font-semibold text-primary">
            {c.amount} {c.amount === 1 ? "Carat" : "Carats"}
          </span>
        </div>
      ))}
    </div>
  );
}
