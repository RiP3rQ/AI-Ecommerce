import type { DrizzleDbClient } from "@/database/index";
import { productImages, products, productVariants } from "@/database/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import type { LatestProductsItem } from "./types";
import type { TestDatabase } from "@/test/utils/db-helper";
import type { GetMainPageSchema } from "./dto";

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
    dto,
    db,
  }: Readonly<{
    dto: GetMainPageSchema;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<LatestProductsItem[]> {
    const { limit, skipFirstNumberOfProducts } = dto;

    // Get latest products with main image and cheapest variant to avoid duplicates
    // First, get products with their cheapest variant using a subquery
    const productsWithVariants = db
      .select({
        productId: sql`${products.id}`.as("product_id"),
        variantId: sql`${productVariants.id}`.as("variant_id"),
        // Use ROW_NUMBER to rank variants by price within each product
        rowNum:
          sql<number>`ROW_NUMBER() OVER (PARTITION BY ${products.id} ORDER BY ${productVariants.price} ASC)`.as(
            "row_num",
          ),
      })
      .from(products)
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .as("products_with_variants");

    // Now get the final result with only the cheapest variant per product
    const latestProducts = await db
      .select({
        products: {
          id: products.id,
          availableForSale: products.availableForSale,
          title: products.title,
          description: products.description,
          descriptionHtml: products.descriptionHtml,
          tags: products.tags,
          categoryId: products.categoryId,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
        },
        product_images: productImages,
        product_variants: productVariants,
      })
      .from(products)
      .leftJoin(
        productImages,
        and(
          eq(products.id, productImages.productId),
          eq(productImages.order, 1),
        ),
      )
      .leftJoin(
        productsWithVariants,
        and(
          eq(products.id, sql`"products_with_variants"."product_id"`),
          eq(productsWithVariants.rowNum, 1),
        ),
      )
      .leftJoin(
        productVariants,
        eq(sql`"products_with_variants"."variant_id"`, productVariants.id),
      )
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(skipFirstNumberOfProducts);

    return latestProducts;
  }
}

export const mainPageService = new MainPageService();
