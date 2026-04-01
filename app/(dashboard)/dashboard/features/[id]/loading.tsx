import { Skeleton } from "@/components/ui/skeleton";

export default function FeatureDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="rounded-lg border border-border bg-card p-6 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
