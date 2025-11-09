import type { DrizzleDbClient } from "@/database/index";
import { products } from "@/database/schemas/products";
import { categories } from "@/database/schemas/categories";
import { productVariants } from "@/database/schemas/product-variants";
import { eq, and, or, ilike, desc, asc, sql, count } from "drizzle-orm";
import {
  InvalidPriceRangeError,
  CategoryNotFoundError,
  InvalidSortFieldError,
} from "@/lib/errors";
import type { GetProductsDto } from "./dto";
import type {
  ProductWithDetails,
  ShopProductsData,
  PaginationMeta,
} from "./types";
import type { SelectProductImage } from "@/database/schemas/product-images";
import type { TestDatabase } from "@/test/utils/db-helper";

/**
 * Service class for shop operations.
 * Handles all business logic for product filtering, sorting, and pagination.
 */
export class ShopService {
  /**
   * Gets products with filtering, sorting, and pagination.
   * @param dto - Filter and pagination parameters
   * @returns Paginated products with metadata
   */
  public async getProducts({
    dto,
    db,
  }: Readonly<{
    dto: GetProductsDto;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<ShopProductsData> {
    const {
      page,
      limit,
      sortDirection,
      sortField,
      search,
      categoryId,
      priceMin,
      priceMax,
      availableForSale,
    } = dto;

    // Validate price range
    if (
      priceMin !== undefined &&
      priceMax !== undefined &&
      priceMin > priceMax
    ) {
      throw new InvalidPriceRangeError();
    }

    // Validate category if provided
    if (categoryId) {
      const categoryExists = await db.query.categories.findFirst({
        where: eq(categories.id, categoryId),
      });

      if (!categoryExists) {
        throw new CategoryNotFoundError(
          `Category with id "${categoryId}" does not exist.`,
        );
      }
    }

    // Build WHERE conditions
    const conditions = this.buildWhereConditions({
      search,
      categoryId,
      availableForSale,
      priceMin,
      priceMax,
    });

    // Get total count for pagination
    const [countResult] = await db
      .select({ count: count() })
      .from(products)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalItems = countResult?.count ?? 0;

    // Calculate pagination
    const totalPages = Math.ceil(totalItems / limit);
    const offset = (page - 1) * limit;

    // Build ORDER BY clause
    const orderByClause = this.buildOrderByClause({ sortField, sortDirection });

    // Query products with relations
    const productsResult = await db.query.products.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        category: true,
        images: {
          orderBy: (images, { asc }) => [asc(images.order)],
        },
        variants: {
          where: eq(productVariants.availableForSale, true),
        },
      },
      orderBy: orderByClause,
      limit,
      offset,
    });

    // Transform products to include computed fields
    const productsWithDetails = productsResult.map((product) =>
      this.transformProductWithDetails(product),
    );

    // Build pagination metadata
    const pagination: PaginationMeta = {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return {
      products: productsWithDetails,
      pagination,
    };
  }

  /**
   * Builds WHERE conditions for product filtering.
   */
  private buildWhereConditions({
    search,
    categoryId,
    availableForSale,
    priceMin,
    priceMax,
  }: Readonly<{
    search?: string;
    categoryId?: string;
    availableForSale?: boolean;
    priceMin?: number;
    priceMax?: number;
  }>) {
    const conditions = [];

    // Search in title or description
    if (search) {
      conditions.push(
        or(
          ilike(products.title, `%${search}%`),
          ilike(products.description, `%${search}%`),
        ),
      );
    }

    // Filter by categoryId
    if (categoryId) {
      conditions.push(
        eq(
          products.categoryId,
          sql`(SELECT id FROM ${categories} WHERE id = ${categoryId})`,
        ),
      );
    }

    // Filter by availability
    if (availableForSale !== undefined) {
      conditions.push(eq(products.availableForSale, availableForSale));
    }

    // Filter by price range - check if product's minimum variant price is in range
    if (priceMin !== undefined || priceMax !== undefined) {
      const minPriceSubquery = sql`(
        SELECT MIN(price) 
        FROM product_variants 
        WHERE product_variants.product_id = products.id 
        AND product_variants.available_for_sale = true
      )`;

      if (priceMin !== undefined && priceMax !== undefined) {
        conditions.push(
          sql`${minPriceSubquery} >= ${priceMin} AND ${minPriceSubquery} <= ${priceMax}`,
        );
      } else if (priceMin !== undefined) {
        conditions.push(sql`${minPriceSubquery} >= ${priceMin}`);
      } else if (priceMax !== undefined) {
        conditions.push(sql`${minPriceSubquery} <= ${priceMax}`);
      }
    }

    return conditions;
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
      case "title":
        return [direction(products.title)];
      case "createdAt":
        return [direction(products.createdAt)];
      case "updatedAt":
        return [direction(products.updatedAt)];
      case "availableForSale":
        return [direction(products.availableForSale)];
      case "price":
        // Sort by minimum variant price (cheapest variant)
        const minPriceSubquery = sql<number>`(
          SELECT COALESCE(MIN(price), 0) 
          FROM product_variants 
          WHERE product_variants.product_id = products.id 
          AND product_variants.available_for_sale = true
        )`;
        return [direction(minPriceSubquery)];
      default:
        throw new InvalidSortFieldError(
          `Sort field "${sortField}" is not supported.`,
        );
    }
  }

  /**
   * Transforms a product with relations into ProductWithDetails.
   */
  private transformProductWithDetails(product: any): ProductWithDetails {
    const variants = product.variants || [];
    const images = product.images || [];

    // Calculate min/max price and currency
    const prices = variants.map((v: any) => v.price);
    const minPrice = variants.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = variants.length > 0 ? Math.max(...prices) : 0;
    const currencyCode = variants.length > 0 ? variants[0].currencyCode : "USD";

    // Get featured image (first image by order)
    const featuredImage = this.getFeaturedImage(images);

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      descriptionHtml: product.descriptionHtml,
      tags: product.tags,
      categoryId: product.categoryId,
      availableForSale: product.availableForSale,
      embedding: product.embedding,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: product.category || null,
      featuredImage,
      minPrice,
      maxPrice,
      currencyCode,
      variantCount: variants.length,
    };
  }

  /**
   * Gets the featured image from a list of product images.
   * The featured image is the one with the lowest order value.
   */
  private getFeaturedImage(
    images: readonly SelectProductImage[],
  ): SelectProductImage | null {
    if (!images || images.length === 0) {
      return null;
    }

    return images.reduce((featured, current) =>
      current.order < featured.order ? current : featured,
    );
  }
}

export const shopService = new ShopService();
