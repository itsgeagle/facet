import { z } from "zod";
import { productTagsConfig } from "@/lib/brand";

const validTagKeys = Object.keys(productTagsConfig) as [string, ...string[]];

export const submitFeatureSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be at most 200 characters"),
  description: z.string().min(1, "Description is required"),
  productTag: z.enum(validTagKeys, { message: "Invalid product tag" }),
});

export type SubmitFeatureInput = z.infer<typeof submitFeatureSchema>;
