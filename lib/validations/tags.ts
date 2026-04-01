import { z } from "zod";

const tagValueRegex = /^[a-z0-9-]+$/;

export const createTagSchema = z.object({
  label: z.string().min(1, "Label is required").max(50, "Label must be at most 50 characters"),
  value: z
    .string()
    .min(1, "Value is required")
    .max(50, "Value must be at most 50 characters")
    .regex(tagValueRegex, "Value must contain only lowercase letters, numbers, and hyphens"),
  color: z.string().min(1, "Color is required"),
  description: z.string().max(200, "Description must be at most 200 characters").optional(),
  isActive: z.boolean().default(true),
});

export const updateTagSchema = createTagSchema;

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
