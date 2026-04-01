import { z } from "zod";
import { ProductTag } from "@/lib/types";

export const submitFeatureSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be at most 200 characters"),
  description: z.string().min(1, "Description is required"),
  productTag: z.nativeEnum(ProductTag, { message: "Invalid product tag" }),
});

export type SubmitFeatureInput = z.infer<typeof submitFeatureSchema>;
