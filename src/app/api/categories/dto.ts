import { z } from "zod";

/**
 * Schema for categories query parameters.
 */
export const getCategoriesSchema = z.object({
  // Sorting
  sortDirection: z.enum(["asc", "desc"]).optional().default("asc"),
  sortField: z.enum(["name", "createdAt", "updatedAt"]).optional().default("name"),
});

export type GetCategoriesDto = z.infer<typeof getCategoriesSchema>;
