import { PRODUCT_TAG_COLORS, PRODUCT_TAG_LABELS } from "@/lib/constants";
import type { ProductTag } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductTagBadgeProps {
  tag: ProductTag;
  className?: string;
}

export function ProductTagBadge({ tag, className }: ProductTagBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        PRODUCT_TAG_COLORS[tag],
        className
      )}
    >
      {PRODUCT_TAG_LABELS[tag]}
    </span>
  );
}
