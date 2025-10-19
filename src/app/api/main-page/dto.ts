import { z } from "zod";

/**
 * Schema for main page query parameters.
 */
export const getMainPageSchema = z.object({
  limit: z.number().int().min(1).max(100).optional().default(3),
  skipFirstNumberOfProducts: z.number().int().min(0).optional().default(0),
});

export type GetMainPageSchema = z.infer<typeof getMainPageSchema>;
