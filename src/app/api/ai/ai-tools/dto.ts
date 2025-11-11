import { z } from 'zod';

/**
 * Schema for individual AI tool information
 */
export const aiToolSchema = z.object({
  name: z.string().describe('The unique name/identifier of the AI tool'),
  description: z.string().describe('User-friendly description of what the tool does'),
});

/**
 * Schema for the response containing all available AI tools
 */
export const getAiToolsResponseSchema = z.object({
  tools: z.array(aiToolSchema).describe('Array of all available AI tools with their descriptions'),
});

/**
 * Type definitions for the DTOs
 */
export type AiToolDto = z.infer<typeof aiToolSchema>;
export type GetAiToolsResponseDto = z.infer<typeof getAiToolsResponseSchema>;
