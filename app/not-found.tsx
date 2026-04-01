"use client";

import Link from "next/link";
import { Gem } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
        <Gem className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-lg font-medium text-foreground">Page not found</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
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
