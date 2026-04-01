import { Gem } from "lucide-react";

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
      <Gem className="h-4 w-4 text-primary" />
      <span>
        <span className="text-primary font-bold">{currentBalance}</span>
        <span className="text-muted-foreground">/{monthlyAllowance} Carats</span>
      </span>
    </div>
  );
}
