import type {
  User,
  FeatureRequest,
  Contribution,
} from "@/app/generated/prisma/client";

export type { User, FeatureRequest, Contribution };
export { Role, ProductTag, FeatureStatus } from "@/app/generated/prisma/client";

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
