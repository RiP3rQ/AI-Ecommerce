import { DrizzleDbClient, drizzleDbClient } from "@/database/index";
import { productImages, products, productVariants } from "@/database/schema";
import { and, desc, eq } from "drizzle-orm";
import type { LatestProductsItem } from "./types";
import type { TestDatabase } from "@/test/utils/db-helper";

/**
 * Service class for main page operations.
 * Handles all business logic for main page data retrieval.
 */
export class MainPageService {
  /**
   * Gets the latest 3 products with their main image and variant data.
   * @param dto - Query parameters (currently empty)
   * @param db - Optional database connection (for testing)
   * @returns Array of latest products with joined data
   */
  public async getLatestProducts({
    db,
  }: Readonly<{
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<LatestProductsItem[]> {
    // Get latest 3 products with main image (order = 1)
    const latestProducts = await db
      .select()
      .from(products)
      .leftJoin(
        productImages,
        and(
          eq(products.id, productImages.productId),
          eq(productImages.order, 1)
        )
      )
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .orderBy(desc(products.createdAt))
      .limit(3);

    return latestProducts;
  }
}

export const mainPageService = new MainPageService();
