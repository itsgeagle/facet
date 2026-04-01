import { cn } from "@/lib/utils";

interface ProductTagBadgeProps {
  tag: { label: string; color: string };
  className?: string;
}

export function ProductTagBadge({ tag, className }: ProductTagBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        tag.color,
        className
      )}
    >
      {tag.label}
    </span>
  );
}
