import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().optional(),
  monthlyAllowance: z.number().int().min(0, "Monthly allowance must be 0 or more").default(10),
});

export const updateAllowanceSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  monthlyAllowance: z.number().int().min(0, "Monthly allowance must be 0 or more"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateAllowanceInput = z.infer<typeof updateAllowanceSchema>;
