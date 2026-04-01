import { ProductTag, FeatureStatus } from "@/lib/types";

export const PRODUCT_TAG_COLORS: Record<ProductTag, string> = {
  [ProductTag.WHITE_DIAMONDS]: "bg-slate-600 text-slate-100",
  [ProductTag.JEWELRY]: "bg-purple-600 text-purple-100",
  [ProductTag.RFID]: "bg-blue-600 text-blue-100",
  [ProductTag.MD_MOBILE]: "bg-orange-600 text-orange-100",
  [ProductTag.MD_COMMERCE]: "bg-pink-600 text-pink-100",
  [ProductTag.MD_CONNECT]: "bg-cyan-600 text-cyan-100",
};

export const PRODUCT_TAG_LABELS: Record<ProductTag, string> = {
  [ProductTag.WHITE_DIAMONDS]: "White Diamonds",
  [ProductTag.JEWELRY]: "Jewelry",
  [ProductTag.RFID]: "RFID",
  [ProductTag.MD_MOBILE]: "MD Mobile",
  [ProductTag.MD_COMMERCE]: "MD Commerce",
  [ProductTag.MD_CONNECT]: "MD Connect",
};

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
