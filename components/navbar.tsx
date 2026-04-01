import Link from "next/link";
import { Gem, Plus, Shield } from "lucide-react";
import { CaratBalanceDisplay } from "@/components/carat-balance-display";
import { UserNav } from "@/components/user-nav";
import { buttonVariants } from "@/components/ui/button";
import { Role } from "@/lib/types";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user: User;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors"
        >
          <Gem className="h-5 w-5 text-primary" />
          <span>The Facet</span>
        </Link>

        <div className="flex items-center gap-3">
          <CaratBalanceDisplay
            currentBalance={user.currentBalance}
            monthlyAllowance={user.monthlyAllowance}
          />

          {user.role === Role.ADMIN && (
            <Link
              href="/admin"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "flex items-center gap-1.5")}
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}

          <Link
            href="/dashboard/submit"
            className={cn(buttonVariants({ size: "sm" }), "flex items-center gap-1.5")}
          >
            <Plus className="h-3.5 w-3.5" />
            Submit
          </Link>

          <UserNav email={user.email} />
        </div>
      </div>
    </header>
  );
}
