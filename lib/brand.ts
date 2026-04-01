import config from "@/config/whitelabel";

export const brand = config.brand;
export const meta = config.meta;
export const company = config.company;
export const currency = config.currency;
export const seedConfig = config.seed;

/**
 * The raw Lucide icon component from the brand config.
 * Use this when passing the icon as a prop (e.g. to a StatCard that expects
 * React.ComponentType), instead of wrapping in <BrandIcon>.
 */
export const BrandLucideIcon = config.brand.icon;

/**
 * Returns the correct unit label for a given count.
 * @example unitLabel(1) // "Carat"
 * @example unitLabel(5) // "Carats"
 */
export function unitLabel(count: number): string {
  return count === 1 ? config.currency.singular : config.currency.plural;
}
