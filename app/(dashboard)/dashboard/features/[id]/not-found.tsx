"use client";

import Link from "next/link";
import { BrandIcon } from "@/components/brand-icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FeatureNotFound() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-24 gap-6 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted">
        <BrandIcon className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">Feature not found</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          This feature request doesn&apos;t exist or may have been removed.
        </p>
      </div>
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ size: "sm" }))}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
