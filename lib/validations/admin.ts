import { z } from "zod";
import { FeatureStatus } from "@/lib/types";

export const approveFeatureSchema = z.object({
  featureId: z.string().min(1, "Feature ID is required"),
  caratCost: z.number().int().min(1, "Carat cost must be at least 1"),
});

export const rejectFeatureSchema = z.object({
  featureId: z.string().min(1, "Feature ID is required"),
  reason: z.string().max(500, "Reason must be 500 characters or less").optional(),
});

export const updateFeatureStatusSchema = z.object({
  featureId: z.string().min(1, "Feature ID is required"),
  status: z.enum([FeatureStatus.IN_PROGRESS, FeatureStatus.SHIPPED]),
});

export type ApproveFeatureInput = z.infer<typeof approveFeatureSchema>;
export type RejectFeatureInput = z.infer<typeof rejectFeatureSchema>;
export type UpdateFeatureStatusInput = z.infer<typeof updateFeatureStatusSchema>;
