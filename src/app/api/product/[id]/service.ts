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
import { eq, inArray } from "drizzle-orm";
import type { TestDatabase } from "@/test/utils/db-helper";

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
   * Gets multiple products by their UUIDs with all related data.
   * @param dto - Product retrieval parameters
   * @param db - Optional database connection (for testing)
   * @returns Array of product data with variants, images, options, and price range
   */
  public async getProducts({
    productIds,
    db,
  }: Readonly<{
    productIds: string[];
    db?: DrizzleDbClient | TestDatabase;
  }>): Promise<ProductData[]> {
    if (productIds.length === 0) {
      return [];
    }

    const dbClient = db || drizzleDbClient();

    // Step 1: Get product data with joins
    const productsData = await dbClient
      .select()
      .from(products)
      .where(inArray(products.id, productIds))
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .leftJoin(productOptions, eq(products.id, productOptions.productId));

    if (!productsData || productsData.length === 0) {
      return [];
    }

    // Step 2: Group data by product ID
    const productsMap = new Map<
      string,
      {
        product: SelectProduct;
        variants: SelectProductVariant[];
        images: SelectProductImage[];
        options: SelectProductOption[];
      }
    >();

    for (const row of productsData) {
      const productId = row.products.id;

      if (!productsMap.has(productId)) {
        productsMap.set(productId, {
          product: row.products,
          variants: [],
          images: [],
          options: [],
        });
      }

      const productData = productsMap.get(productId)!;

      // Add variant if not already present
      if (
        row.product_variants &&
        !productData.variants.some((v) => v.id === row.product_variants!.id)
      ) {
        productData.variants.push(row.product_variants);
      }

      // Add image if not already present
      if (
        row.product_images &&
        !productData.images.some((i) => i.id === row.product_images!.id)
      ) {
        productData.images.push(row.product_images);
      }

      // Add option if not already present
      if (
        row.product_options &&
        !productData.options.some((o) => o.id === row.product_options!.id)
      ) {
        productData.options.push(row.product_options);
      }
    }

    // Step 3: Transform each product into the expected format
    const result: ProductData[] = [];

    for (const [productId, data] of productsMap) {
      // Sort images by order
      data.images.sort((a, b) => a.order - b.order);

      // Sort options by position
      data.options.sort((a, b) => a.position - b.position);

      // Calculate price range
      const priceRange = this.calculatePriceRange(data.variants);

      result.push({
        ...data.product,
        product_variants: data.variants,
        product_images: data.images,
        product_options: data.options,
        priceRange,
      });
    }

    // Step 4: Return products in the same order as requested IDs
    const orderedResult = productIds
      .map((id) => result.find((product) => product.id === id))
      .filter(Boolean) as ProductData[];

    return orderedResult;
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
