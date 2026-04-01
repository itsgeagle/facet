import { PRODUCT_TAG_COLORS, PRODUCT_TAG_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProductTagBadgeProps {
  tag: string;
  className?: string;
}

export function ProductTagBadge({ tag, className }: ProductTagBadgeProps) {
  const color = PRODUCT_TAG_COLORS[tag] ?? "bg-slate-600 text-slate-100";
  const label = PRODUCT_TAG_LABELS[tag] ?? tag;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        color,
        className
      )}
    >
      {label}
    </span>
  );
}
