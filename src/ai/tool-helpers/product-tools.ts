import { drizzleDbClient } from "@/database";
import {
  products,
  categories,
  reviews,
  reviewSummaries,
} from "@/database/schema";
import { desc, eq, inArray, sql, gt, and, like } from "drizzle-orm";

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
        eq(categories.name, categoryName),
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
    (tag) => sql`${products.tags}::text LIKE ${`%${tag}%`}`,
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
