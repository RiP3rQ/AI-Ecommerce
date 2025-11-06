import { z } from "zod";

/**
 * Schema for AI assistant chat requests.
 * Validates the structure of messages, model selection, and web search option.
 */
export const aiAssistantSchema = z.object({
  id: z.string(),
  messages: z
    .array(
      z.object({
        id: z.string().optional(),
        role: z.enum(["user", "assistant"]),
        parts: z
          .array(
            z.object({
              type: z.literal("text"),
              text: z.string().min(1, "Message content cannot be empty"),
            }),
          )
          .default([]),
        avatar: z.string().optional(),
        name: z.string().optional(),
      }),
    )
    .min(1, "At least one message is required")
    .max(50, "Cannot have more than 50 messages"),
  trigger: z.string(),
  messageId: z.string(),
});

export type AiAssistantDto = z.infer<typeof aiAssistantSchema>;
