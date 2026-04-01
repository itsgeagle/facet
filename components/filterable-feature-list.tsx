"use client";

import { useState } from "react";
import { FeatureList } from "@/components/feature-list";
import { ProductTagBadge } from "@/components/product-tag-badge";
import type { FeatureWithAuthor, ProductTag } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FilterableFeatureListProps {
  features: FeatureWithAuthor[];
  emptyMessage?: string;
  emptyDescription?: string;
  showSubmitCta?: boolean;
}

export function FilterableFeatureList({
  features,
  emptyMessage,
  emptyDescription,
  showSubmitCta,
}: FilterableFeatureListProps) {
  const [activeTagId, setActiveTagId] = useState<string | null>(null);

  // Derive unique tags from the features themselves, sorted by sortOrder
  const tagMap = new Map<string, ProductTag>();
  features.forEach((f) => tagMap.set(f.productTagId, f.productTag));
  const usedTags = Array.from(tagMap.values()).sort((a, b) => a.sortOrder - b.sortOrder);

  const filtered =
    activeTagId === null ? features : features.filter((f) => f.productTagId === activeTagId);

  return (
    <div className="space-y-4">
      {usedTags.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTagId(null)}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
              activeTagId === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            All
          </button>
          {usedTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setActiveTagId(activeTagId === tag.id ? null : tag.id)}
              className={cn(
                "transition-opacity",
                activeTagId !== null && activeTagId !== tag.id ? "opacity-50" : "opacity-100"
              )}
            >
              <ProductTagBadge tag={tag} />
            </button>
          ))}
        </div>
      )}
      <FeatureList
        features={filtered}
        emptyMessage={activeTagId !== null ? "No features match this filter." : emptyMessage}
        emptyDescription={activeTagId !== null ? undefined : emptyDescription}
        showSubmitCta={activeTagId === null ? showSubmitCta : false}
      />
    </div>
  );
}
