import { FeatureStatus } from "@/lib/types";

export const STATUS_COLORS: Record<FeatureStatus, string> = {
  [FeatureStatus.PENDING]: "bg-yellow-600 text-yellow-100",
  [FeatureStatus.OPEN]: "bg-emerald-600 text-emerald-100",
  [FeatureStatus.COMMITTED]: "bg-blue-600 text-blue-100",
  [FeatureStatus.IN_PROGRESS]: "bg-purple-600 text-purple-100",
  [FeatureStatus.SHIPPED]: "bg-slate-600 text-slate-100",
  [FeatureStatus.REJECTED]: "bg-red-600 text-red-100",
};

export const STATUS_LABELS: Record<FeatureStatus, string> = {
  [FeatureStatus.PENDING]: "Pending",
  [FeatureStatus.OPEN]: "Open",
  [FeatureStatus.COMMITTED]: "Committed",
  [FeatureStatus.IN_PROGRESS]: "In Progress",
  [FeatureStatus.SHIPPED]: "Shipped",
  [FeatureStatus.REJECTED]: "Rejected",
};
