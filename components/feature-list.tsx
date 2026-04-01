import { FeatureCard } from "@/components/feature-card";
import type { FeatureWithAuthor } from "@/lib/types";

interface FeatureListProps {
  features: FeatureWithAuthor[];
  emptyMessage?: string;
}

export function FeatureList({
  features,
  emptyMessage = "No features found.",
}: FeatureListProps) {
  if (features.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((feature) => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </div>
  );
}
