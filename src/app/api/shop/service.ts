import { drizzleDbClient } from "@/database/index";
import { products } from "@/database/schemas/products";
import { categories } from "@/database/schemas/categories";
import { productVariants } from "@/database/schemas/product-variants";
import { productImages } from "@/database/schemas/product-images";
import {
  eq,
  and,
  or,
  gte,
  lte,
  ilike,
  desc,
  asc,
  sql,
  count,
} from "drizzle-orm";
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

/**
 * Service class for shop operations.
 * Handles all business logic for product filtering, sorting, and pagination.
 */
export class ShopService {
  private readonly db = drizzleDbClient();

  /**
   * Gets products with filtering, sorting, and pagination.
   * @param dto - Filter and pagination parameters
   * @returns Paginated products with metadata
   */
  public async getProducts({
    dto,
  }: Readonly<{
    dto: GetProductsDto;
  }>): Promise<ShopProductsData> {
    const {
      page,
      limit,
      sortDirection,
      sortField,
      search,
      category,
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
    if (category) {
      const categoryExists = await this.db.query.categories.findFirst({
        where: eq(categories.id, category),
      });

      if (!categoryExists) {
        throw new CategoryNotFoundError(
          `Category with id "${category}" does not exist.`
        );
      }
    }

    // Build WHERE conditions
    const conditions = this.buildWhereConditions({
      search,
      category,
      availableForSale,
    });

    // Get total count for pagination
    const [countResult] = await this.db
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
    const productsResult = await this.db.query.products.findMany({
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

    // Filter by price range if provided (done after query due to aggregation)
    let filteredProducts = productsResult;
    if (priceMin !== undefined || priceMax !== undefined) {
      filteredProducts = this.filterByPriceRange({
        products: productsResult,
        priceMin,
        priceMax,
      });
    }

    // Transform products to include computed fields
    const productsWithDetails = filteredProducts.map((product) =>
      this.transformProductWithDetails(product)
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
    category,
    availableForSale,
  }: Readonly<{
    search?: string;
    category?: string;
    availableForSale?: boolean;
  }>) {
    const conditions = [];

    // Search in title or description
    if (search) {
      conditions.push(
        or(
          ilike(products.title, `%${search}%`),
          ilike(products.description, `%${search}%`)
        )
      );
    }

    // Filter by category
    if (category) {
      conditions.push(
        eq(
          products.categoryId,
          sql`(SELECT id FROM ${categories} WHERE name = ${category})`
        )
      );
    }

    // Filter by availability
    if (availableForSale !== undefined) {
      conditions.push(eq(products.availableForSale, availableForSale));
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
      // Price sorting handled after query due to aggregation
      case "price":
        return [direction(products.createdAt)]; // Default to createdAt for now
      default:
        throw new InvalidSortFieldError(
          `Sort field "${sortField}" is not supported.`
        );
    }
  }

  /**
   * Filters products by price range (client-side filtering after query).
   */
  private filterByPriceRange({
    products,
    priceMin,
    priceMax,
  }: Readonly<{
    products: any[];
    priceMin?: number;
    priceMax?: number;
  }>) {
    return products.filter((product) => {
      const variants = product.variants || [];
      if (variants.length === 0) return false;

      const prices = variants.map((v: any) => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (priceMin !== undefined && maxPrice < priceMin) return false;
      if (priceMax !== undefined && minPrice > priceMax) return false;

      return true;
    });
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
    images: readonly SelectProductImage[]
  ): SelectProductImage | null {
    if (!images || images.length === 0) {
      return null;
    }

    return images.reduce((featured, current) =>
      current.order < featured.order ? current : featured
    );
  }
}

export const shopService = new ShopService();
