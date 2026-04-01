// Enums defined as const objects — client-safe, no Prisma runtime import needed.
// Values must exactly match the Prisma schema enum values.

export const Role = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export interface ProductTag {
  id: string;
  value: string;
  label: string;
  color: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
}

export const FeatureStatus = {
  PENDING: "PENDING",
  OPEN: "OPEN",
  COMMITTED: "COMMITTED",
  IN_PROGRESS: "IN_PROGRESS",
  SHIPPED: "SHIPPED",
  REJECTED: "REJECTED",
} as const;
export type FeatureStatus = (typeof FeatureStatus)[keyof typeof FeatureStatus];

// Lightweight model types — mirror Prisma shapes without importing @prisma/client.
export interface User {
  id: string;
  email: string;
  role: Role;
  monthlyAllowance: number;
  currentBalance: number;
  companyName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  productTagId: string;
  productTag: ProductTag;
  status: FeatureStatus;
  caratCost: number | null;
  totalFunded: number;
  rejectionReason: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contribution {
  id: string;
  userId: string;
  featureId: string;
  amount: number;
  createdAt: Date;
}

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export type FeatureWithAuthor = FeatureRequest & {
  author: Pick<User, "id" | "email" | "companyName">;
};

export type FeatureWithContributions = FeatureRequest & {
  author: Pick<User, "id" | "email" | "companyName">;
  contributions: (Contribution & {
    user: Pick<User, "id" | "email" | "companyName">;
  })[];
};
