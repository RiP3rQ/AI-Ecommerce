import { drizzleDbClient } from "@/database/index";
import { categories } from "@/database/schemas/categories";
import { desc, asc } from "drizzle-orm";
import { InvalidSortFieldError } from "@/lib/errors";
import type { GetCategoriesDto } from "./dto";
import type { CategoriesResponse } from "./types";

/**
 * Service class for categories operations.
 * Handles all business logic for category retrieval and management.
 */
export class CategoriesService {
  private readonly db = drizzleDbClient();

  /**
   * Gets all categories with optional sorting.
   * @param dto - Sorting parameters
   * @returns Array of categories
   */
  public async getCategories({
    dto,
  }: Readonly<{
    dto: GetCategoriesDto;
  }>): Promise<CategoriesResponse> {
    const { sortDirection, sortField } = dto;

    // Build ORDER BY clause
    const orderByClause = this.buildOrderByClause({ sortField, sortDirection });

    // Query categories
    const categoriesResult = await this.db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      })
      .from(categories)
      .orderBy(...orderByClause);

    return {
      success: true,
      data: categoriesResult,
    };
  }

  /**
   * Builds ORDER BY clause based on sort field and direction.
   */
  private buildOrderByClause({
    sortField,
    sortDirection,
  }: Readonly<{
    sortField: string;
    sortDirection: "asc" | "desc";
  }>) {
    const direction = sortDirection === "asc" ? asc : desc;

    switch (sortField) {
      case "name":
        return [direction(categories.name)];
      case "createdAt":
        return [direction(categories.createdAt)];
      case "updatedAt":
        return [direction(categories.updatedAt)];
      default:
        throw new InvalidSortFieldError(
          `Sort field "${sortField}" is not supported.`
        );
    }
  }
}

export const categoriesService = new CategoriesService();
