"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { FeatureCard } from "@/components/feature-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FeatureWithAuthor } from "@/lib/types";

interface FeatureListProps {
  features: FeatureWithAuthor[];
  emptyMessage?: string;
  emptyDescription?: string;
  showSubmitCta?: boolean;
}

export function FeatureList({
  features,
  emptyMessage = "No features found.",
  emptyDescription,
  showSubmitCta = false,
}: FeatureListProps) {
  if (features.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted">
          <BrandIcon className="h-7 w-7 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">{emptyMessage}</p>
          {emptyDescription && (
            <p className="text-sm text-muted-foreground max-w-xs">{emptyDescription}</p>
          )}
        </div>
        {showSubmitCta && (
          <Link
            href="/dashboard/submit"
            className={cn(buttonVariants({ size: "sm" }), "flex items-center gap-1.5")}
          >
            <Plus className="h-3.5 w-3.5" />
            Submit the first feature
          </Link>
        )}
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
