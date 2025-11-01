import { z } from "zod";
import { uuidSchema } from "../product/[id]/dto";

/**
 * Schema for user registration request.
 * Validates the data sent from the frontend after Supabase signup.
 */
export const registerUserSchema = z.object({
  email: z.string().email("Invalid email address."),
  userId: uuidSchema,
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
