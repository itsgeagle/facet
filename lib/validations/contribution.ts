import { z } from "zod";

export const contributeSchema = z.object({
  featureId: z.string().min(1, "Feature ID is required"),
  amount: z.number().int().min(1, "Amount must be at least 1"),
});

export type ContributeInput = z.infer<typeof contributeSchema>;
