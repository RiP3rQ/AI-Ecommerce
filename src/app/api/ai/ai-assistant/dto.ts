import { z } from "zod";

/**
 * Schema for AI assistant chat requests.
 * Validates the structure of messages, model selection, and web search option.
 */
export const aiAssistantSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1, "Message content cannot be empty"),
        id: z.string().optional(),
        createdAt: z.date().optional(),
        parts: z
          .array(
            z.object({
              type: z.literal("text"),
              text: z.string().min(1, "Message content cannot be empty"),
            }),
          )
          .default([]),
      }),
    )
    .min(1, "At least one message is required")
    .max(50, "Cannot have more than 50 messages"),
});

export type AiAssistantDto = z.infer<typeof aiAssistantSchema>;
