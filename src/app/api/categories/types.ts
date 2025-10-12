import type { SelectCategory } from "@/database/schemas/categories";

/**
 * Categories list response.
 */
export interface CategoriesResponse {
  success: boolean;
  data: SelectCategory[];
}
