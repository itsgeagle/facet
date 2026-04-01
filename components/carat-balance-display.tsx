import { BrandIcon } from "@/components/brand-icon";
import { currency } from "@/lib/brand";

interface CaratBalanceDisplayProps {
  currentBalance: number;
  monthlyAllowance: number;
}

export function CaratBalanceDisplay({
  currentBalance,
  monthlyAllowance,
}: CaratBalanceDisplayProps) {
  return (
    <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
      <BrandIcon className="h-4 w-4 text-primary" />
      <span>
        <span className="text-primary font-bold">{currentBalance}</span>
        <span className="text-muted-foreground">/{monthlyAllowance} {currency.plural}</span>
      </span>
    </div>
  );
}
