import { z } from "zod";

export const submitFeatureSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be at most 200 characters"),
  description: z.string().min(1, "Description is required"),
  productTagId: z.string().min(1, "Please select a product"),
});

export type SubmitFeatureInput = z.infer<typeof submitFeatureSchema>;
