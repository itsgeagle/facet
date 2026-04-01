import { BrandLucideIcon } from "@/lib/brand";

interface BrandIconProps {
  className?: string;
}

/**
 * Renders the brand icon defined in config/whitelabel.ts.
 * Works in both server and client components.
 */
export function BrandIcon({ className }: BrandIconProps) {
  return <BrandLucideIcon className={className} />;
}
