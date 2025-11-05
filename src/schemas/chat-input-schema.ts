import { z } from "zod";

export const chatInputSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message cannot exceed 1000 characters"),
});

export type ChatInputSchema = z.infer<typeof chatInputSchema>;
