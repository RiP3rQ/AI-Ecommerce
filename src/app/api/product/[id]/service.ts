import { type DrizzleDbClient, drizzleDbClient } from "@/database/index";
import {
  productImages,
  productOptions,
  products,
  productVariants,
  SelectProduct,
  type SelectProductImage,
  type SelectProductOption,
  type SelectProductVariant,
} from "@/database/schema";
import { ProductNotFoundError } from "@/lib/errors";
import type { PriceRange } from "@/types/products";
import type { GetProductDto } from "./dto";
import type { ProductData } from "./types";
import { eq } from "drizzle-orm";
import type { TestDatabase } from "@/test/utils/db-helper";
import { id } from "zod/v4/locales";

/**
 * Service class for product operations.
 * Handles all business logic for product retrieval and management.
 */
export class ProductService {
  /**
   * Gets a single product by UUID with all related data.
   * @param dto - Product retrieval parameters
   * @param db - Optional database connection (for testing)
   * @returns Product data with variants, images, options, and price range
   */
  public async getProduct({
    dto,
    db,
  }: Readonly<{
    dto: GetProductDto;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<ProductData> {
    const { id } = dto;

    // Step 1: Get product data with joins
    const productData = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .leftJoin(productOptions, eq(products.id, productOptions.productId));

    if (!productData || productData.length === 0) {
      throw new ProductNotFoundError(`Product with uuid ${id} not found`);
    }

    // Step 2: Transform the joined result into the expected format
    const product = productData[0].products;

    // Deduplicate variants by ID
    const variantsMap = new Map<string, SelectProductVariant>();
    for (const row of productData) {
      if (row.product_variants) {
        variantsMap.set(row.product_variants.id, row.product_variants);
      }
    }
    const product_variants = Array.from(variantsMap.values());

    // Deduplicate images by ID and sort by order
    const imagesMap = new Map<string, SelectProductImage>();
    for (const row of productData) {
      if (row.product_images) {
        imagesMap.set(row.product_images.id, row.product_images);
      }
    }
    const product_images = Array.from(imagesMap.values()).sort(
      (a, b) => a.order - b.order,
    );

    // Deduplicate options by ID and sort by position
    const optionsMap = new Map<string, SelectProductOption>();
    for (const row of productData) {
      if (row.product_options) {
        optionsMap.set(row.product_options.id, row.product_options);
      }
    }
    const product_options = Array.from(optionsMap.values()).sort(
      (a, b) => a.position - b.position,
    );

    // Step 3: Calculate the price range
    const priceRange = this.calculatePriceRange(product_variants);

    // Step 4: Return the product data
    return {
      ...product,
      product_variants,
      product_images,
      product_options,
      priceRange,
    };
  }

  /**
   * Calculates the minimum and maximum price range from product variants.
   */
  private calculatePriceRange(
    product_variants: SelectProductVariant[],
  ): PriceRange {
    // Calculate min and max variant price, ensuring the currencyCode matches the min/max value
    let minVariantPrice = {
      amount: Number.POSITIVE_INFINITY,
      currencyCode: "USD",
    };
    let maxVariantPrice = {
      amount: Number.NEGATIVE_INFINITY,
      currencyCode: "USD",
    };

    for (const variant of product_variants) {
      if (variant.price < minVariantPrice.amount) {
        minVariantPrice = {
          amount: variant.price,
          currencyCode: variant.currencyCode,
        };
      }
      if (variant.price > maxVariantPrice.amount) {
        maxVariantPrice = {
          amount: variant.price,
          currencyCode: variant.currencyCode,
        };
      }
    }

    // Handle case where there are no variants
    if (!product_variants.length) {
      minVariantPrice = { amount: 0, currencyCode: "USD" };
      maxVariantPrice = { amount: 0, currencyCode: "USD" };
    }

    return {
      minVariantPrice,
      maxVariantPrice,
    };
  }
}

export const productService = new ProductService();
