"use client";

import { useState } from "react";
import { FeatureList } from "@/components/feature-list";
import { ProductTagBadge } from "@/components/product-tag-badge";
import { ProductTag } from "@/lib/types";
import type { FeatureWithAuthor } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL_TAGS = Object.values(ProductTag);

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
  const [activeTag, setActiveTag] = useState<ProductTag | null>(null);

  const usedTags = Array.from(new Set(features.map((f) => f.productTag)));
  const filtered =
    activeTag === null ? features : features.filter((f) => f.productTag === activeTag);

  return (
    <div className="space-y-4">
      {usedTags.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
              activeTag === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            All
          </button>
          {ALL_TAGS.filter((t) => usedTags.includes(t)).map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={cn(
                "transition-opacity",
                activeTag !== null && activeTag !== tag ? "opacity-50" : "opacity-100"
              )}
            >
              <ProductTagBadge tag={tag} />
            </button>
          ))}
        </div>
      )}
      <FeatureList
        features={filtered}
        emptyMessage={
          activeTag !== null
            ? "No features match this filter."
            : emptyMessage
        }
        emptyDescription={activeTag !== null ? undefined : emptyDescription}
        showSubmitCta={activeTag === null ? showSubmitCta : false}
      />
    </div>
  );
}
