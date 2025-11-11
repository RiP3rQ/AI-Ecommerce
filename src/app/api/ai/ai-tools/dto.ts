import { z } from "zod";

export enum AiToolCategory {
  PRODUCT_DISCOVERY = "product-discovery",
  CART_MANAGEMENT = "cart-management",
  OUTFIT_STYLING = "outfit-styling",
  PRODUCT_RECOMMENDATIONS = "product-recommendations",
}

/**
 * Schema for individual AI tool information
 */
export const aiToolSchema = z.object({
  name: z.string().describe("The unique name/identifier of the AI tool"),
  description: z
    .string()
    .describe("User-friendly description of what the tool does"),
  category: z
    .enum(Object.values(AiToolCategory))
    .describe("The category of the tool"),
});

/**
 * Schema for the response containing all available AI tools
 */
export const getAiToolsResponseSchema = z.object({
  tools: z
    .array(aiToolSchema)
    .describe("Array of all available AI tools with their descriptions"),
});

/**
 * Type definitions for the DTOs
 */
export type AiToolDto = z.infer<typeof aiToolSchema>;
export type GetAiToolsResponseDto = z.infer<typeof getAiToolsResponseSchema>;
