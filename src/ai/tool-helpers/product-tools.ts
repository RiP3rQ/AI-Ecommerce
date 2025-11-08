import { drizzleDbClient } from "@/database";
import {
  products,
  categories,
  reviews,
  reviewSummaries,
  productVariants,
} from "@/database/schema";
import { desc, eq, sql, and, ilike, inArray, or } from "drizzle-orm";

/**
 * Configuration for product queries.
 */
const PRODUCT_CONFIG = {
  maxResults: 20,
  minRating: 4.0, // Minimum rating for "liked" products
} as const;

/**
 * Gets all available categories from the database.
 */
export async function getAllCategories(): Promise<
  Array<{
    id: string;
    name: string;
    description?: string | null;
  }>
> {
  const db = drizzleDbClient();

  const categoriesData = await db
    .select({
      id: categories.id,
      name: categories.name,
      description: categories.description,
    })
    .from(categories)
    .orderBy(categories.name);

  return categoriesData;
}

/**
 * Gets products for a specific category.
 */
export async function getProductsByCategory(
  categoryName: string,
  limit: number = PRODUCT_CONFIG.maxResults,
): Promise<
  Array<{
    id: string;
    title: string;
    description?: string | null;
    tags: string[] | null;
  }>
> {
  const db = drizzleDbClient();

  const productsData = await db
    .select({
      id: products.id,
      title: products.title,
      description: products.description,
      tags: products.tags,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(sql`LOWER(${categories.name})`, sql`LOWER(${categoryName})`),
        eq(products.availableForSale, true),
      ),
    )
    .orderBy(desc(products.createdAt))
    .limit(limit);

  return productsData;
}

/**
 * Gets the most liked products based on average rating and number of reviews.
 */
export async function getMostLikedProducts(
  limit: number = PRODUCT_CONFIG.maxResults,
): Promise<
  Array<{
    id: string;
    title: string;
    description?: string | null;
    tags: string[] | null;
    averageRating: number;
    reviewCount: number;
  }>
> {
  const db = drizzleDbClient();

  // Get products with their average rating and review count
  const productsWithRatings = await db
    .select({
      id: products.id,
      title: products.title,
      description: products.description,
      tags: products.tags,
      averageRating: sql<number>`AVG(${reviews.rating})::numeric(3,1)`,
      reviewCount: sql<number>`COUNT(${reviews.id})::int`,
    })
    .from(products)
    .leftJoin(reviews, eq(products.id, reviews.productId))
    .where(eq(products.availableForSale, true))
    .groupBy(products.id, products.title, products.description, products.tags)
    .having(sql`COUNT(${reviews.id}) > 0`)
    .orderBy(desc(sql`AVG(${reviews.rating})`), desc(sql`COUNT(${reviews.id})`))
    .limit(limit);

  return productsWithRatings;
}

/**
 * Searches products by tags.
 */
export async function searchProductsByTags(
  tags: string[],
  limit: number = PRODUCT_CONFIG.maxResults,
): Promise<
  Array<{
    id: string;
    title: string;
    description?: string | null;
    tags: string[] | null;
  }>
> {
  const db = drizzleDbClient();

  // Create conditions for each tag (products.tags contains any of the search tags)
  const tagConditions = tags.map(
    (tag) => sql`LOWER(${products.tags}::text) LIKE LOWER(${`%${tag}%`})`,
  );

  const productsData = await db
    .select({
      id: products.id,
      title: products.title,
      description: products.description,
      tags: products.tags,
    })
    .from(products)
    .where(
      and(
        eq(products.availableForSale, true),
        sql`(${sql.join(tagConditions, sql` OR `)})`,
      ),
    )
    .orderBy(desc(products.createdAt))
    .limit(limit);

  return productsData;
}

/**
 * Gets detailed information about a specific product including variants and images.
 */
export async function getProductDetails(productId: string): Promise<{
  id: string;
  title: string;
  description?: string | null;
  tags: string[] | null;
  category?: {
    id: string;
    name: string;
    description?: string | null;
  } | null;
  reviewSummary?: string | null;
  averageRating?: number;
  reviewCount: number;
} | null> {
  const db = drizzleDbClient();

  // Get product with category
  const productData = await db
    .select({
      id: products.id,
      title: products.title,
      description: products.description,
      tags: products.tags,
      categoryId: products.categoryId,
      categoryName: categories.name,
      categoryDescription: categories.description,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, productId))
    .limit(1);

  if (productData.length === 0) {
    return null;
  }

  const product = productData[0];

  // Get review summary and rating stats
  const reviewStats = await db
    .select({
      summary: reviewSummaries.summary,
      averageRating: sql<number>`AVG(${reviews.rating})::numeric(3,1)`,
      reviewCount: sql<number>`COUNT(${reviews.id})::int`,
    })
    .from(reviewSummaries)
    .leftJoin(reviews, eq(reviewSummaries.productId, reviews.productId))
    .where(eq(reviewSummaries.productId, productId))
    .groupBy(reviewSummaries.summary)
    .limit(1);

  const stats =
    reviewStats.length > 0
      ? reviewStats[0]
      : { summary: null, averageRating: null, reviewCount: 0 };

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    tags: product.tags,
    category: product.categoryId
      ? {
          id: product.categoryId,
          name: product.categoryName!,
          description: product.categoryDescription,
        }
      : null,
    reviewSummary: stats.summary,
    averageRating: stats.averageRating ?? undefined,
    reviewCount: stats.reviewCount,
  };
}

/**
 * Gets detailed information about products including all available variants with prices.
 * Used for add-to-cart flow to show all variant options to the user.
 */
export async function getProductDetailsWithVariants(
  productIds: string[],
): Promise<
  Array<{
    id: string;
    title: string;
    description?: string | null;
    tags: string[] | null;
    variants: Array<{
      id: string;
      title: string;
      price: number;
      currencyCode: string;
      availableForSale: boolean;
      selectedOptions: { name: string; value: string }[];
      inventoryQuantity?: number | null;
    }>;
  }>
> {
  const db = drizzleDbClient();

  const productsData = await db
    .select({
      id: products.id,
      title: products.title,
      description: products.description,
      tags: products.tags,
    })
    .from(products)
    .where(inArray(products.id, productIds));

  // Get variants for all products
  const variantsData = await db
    .select({
      id: productVariants.id,
      productId: productVariants.productId,
      title: productVariants.title,
      price: productVariants.price,
      currencyCode: productVariants.currencyCode,
      availableForSale: productVariants.availableForSale,
      selectedOptions: productVariants.selectedOptions,
      inventoryQuantity: productVariants.inventoryQuantity,
    })
    .from(productVariants)
    .where(inArray(productVariants.productId, productIds));

  // Map variants to products
  return productsData.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    tags: product.tags,
    variants: variantsData
      .filter((variant) => variant.productId === product.id)
      .map((variant) => ({
        id: variant.id,
        title: variant.title,
        price: variant.price,
        currencyCode: variant.currencyCode,
        availableForSale: variant.availableForSale,
        selectedOptions: variant.selectedOptions,
        inventoryQuantity: variant.inventoryQuantity,
      })),
  }));
}

/**
 * Gets reviews for a specific product.
 */
export async function getProductReviews(
  productId: string,
  limit: number = 10,
): Promise<
  Array<{
    id: string;
    rating: number;
    content: string;
    createdAt: Date;
  }>
> {
  const db = drizzleDbClient();

  const reviewsData = await db
    .select({
      id: reviews.id,
      rating: sql<number>`${reviews.rating}::numeric(3,1)`,
      content: reviews.content,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);

  return reviewsData;
}

/**
 * Searches products by name (case-insensitive).
 * Supports multi-word queries where all words must be present in title or description.
 */
export async function searchProductsByName(
  query: string,
  limit: number = PRODUCT_CONFIG.maxResults,
): Promise<
  Array<{
    id: string;
    title: string;
    description?: string | null;
    tags: string[] | null;
  }>
> {
  const db = drizzleDbClient();

  // Split query into individual words and filter out empty strings
  const searchWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  if (searchWords.length === 0) {
    return [];
  }

  // Create conditions for each search word
  // Each word must appear in either title or description
  const wordConditions = searchWords.map((word) =>
    or(
      ilike(products.title, `%${word}%`),
      ilike(products.description, `%${word}%`),
    ),
  );

  const productsQuery = db
    .select({
      id: products.id,
      title: products.title,
      description: products.description,
      tags: products.tags,
    })
    .from(products)
    .where(
      and(
        eq(products.availableForSale, true),
        // All search words must match (AND logic between words)
        and(...wordConditions),
      ),
    )
    .orderBy(desc(products.createdAt))
    .groupBy(products.id, products.title, products.description, products.tags)
    .limit(limit);

  const productsData = await productsQuery.execute();

  return productsData;
}
