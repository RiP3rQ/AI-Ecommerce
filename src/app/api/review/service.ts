import type { DrizzleDbClient } from "@/database/index";
import { embed } from "ai";
import { reviews, products, profiles } from "@/database/schema";
import { geminiProvider } from "@/ai/gemini-provider";
import { eq, desc, sql, count } from "drizzle-orm";
import { ProductNotFoundError, UserNotFoundError } from "@/lib/errors";
import type { CreateReviewDto, GetReviewsDto } from "./dto";
import type { ReviewsData, ReviewWithUser, PaginationMeta } from "./types";
import type { TestDatabase } from "@/test/utils/db-helper";

/**
 * Configuration for review embedding generation.
 */
const EMBEDDING_CONFIG = {
  model: geminiProvider.textEmbeddingModel("gemini-embedding-001"),
  outputDimensionality: 1536,
} as const;

/**
 * Service class for review operations.
 * Handles all business logic for review creation, retrieval, and embedding generation.
 */
export class ReviewService {
  /**
   * Gets reviews with filtering and pagination.
   * @param dto - Filter and pagination parameters
   * @returns Paginated reviews with metadata
   */
  public async getReviews({
    dto,
    db,
  }: Readonly<{
    dto: GetReviewsDto;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<ReviewsData> {
    const { page, limit, productId } = dto;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    if (productId) {
      whereConditions.push(eq(reviews.productId, productId));
    }

    // Get total count
    const [{ totalCount }] = await db
      .select({ totalCount: count(reviews.id) })
      .from(reviews)
      .where(
        whereConditions.length > 0
          ? sql`${sql.join(whereConditions, " AND ")}`
          : undefined,
      );

    // Get reviews with user information
    const reviewResults = await db
      .select({
        id: reviews.id,
        productId: reviews.productId,
        userId: reviews.userId,
        rating: reviews.rating,
        content: reviews.content,
        embeddingStatus: reviews.embeddingStatus,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        userEmail: profiles.email,
      })
      .from(reviews)
      .innerJoin(profiles, eq(reviews.userId, profiles.id))
      .where(
        whereConditions.length > 0
          ? sql`${sql.join(whereConditions, " AND ")}`
          : undefined,
      )
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    const reviewsData: ReviewWithUser[] = reviewResults.map((review) => ({
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      rating: Number(review.rating),
      content: review.content,
      embeddingStatus: review.embeddingStatus,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: {
        id: review.userId,
        email: review.userEmail,
      },
    }));

    // Calculate pagination metadata
    const totalItems = Number(totalCount);
    const totalPages = Math.ceil(totalItems / limit);
    const pagination: PaginationMeta = {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return {
      reviews: reviewsData,
      pagination,
    };
  }

  /**
   * Creates a new review for a product.
   * Automatically generates embeddings for the review content.
   * @param dto - Review creation parameters
   * @returns Created review data
   */
  public async createReview({
    dto,
    userId,
    db,
  }: Readonly<{
    dto: CreateReviewDto;
    userId: string;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<{
    id: string;
    productId: string;
    userId: string;
    rating: number;
    content: string;
    embeddingStatus: string | null;
    createdAt: Date;
    updatedAt: Date;
  }> {
    // Verify that the product exists
    const product = await db.query.products.findFirst({
      where: eq(products.id, dto.productId),
    });

    if (!product) {
      throw new ProductNotFoundError();
    }

    // Verify that the user exists
    const user = await db.query.profiles.findFirst({
      where: eq(profiles.id, userId),
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    // Create the review with pending embedding status
    const [newReview] = await db
      .insert(reviews)
      .values({
        productId: dto.productId,
        userId,
        rating: Math.round(dto.rating * 2) / 2, // Ensure 0.5 increments, store as decimal
        content: dto.content,
        embeddingStatus: "pending",
      })
      .returning();

    // Generate embedding asynchronously (don't block the response)
    this.generateReviewEmbedding(newReview.id, dto.content, db).catch(
      (error) => {
        console.error(
          `Failed to generate embedding for review ${newReview.id}:`,
          error,
        );
      },
    );

    return newReview;
  }

  /**
   * Generates and stores embedding for a review.
   * This is done asynchronously to avoid blocking the response.
   * @param reviewId - ID of the review
   * @param content - Review content to embed
   * @param db - Database instance
   */
  private async generateReviewEmbedding(
    reviewId: string,
    content: string,
    db: DrizzleDbClient | TestDatabase,
  ): Promise<void> {
    try {
      // Generate embedding for the review content
      const result = await embed({
        model: EMBEDDING_CONFIG.model,
        value: content,
        providerOptions: {
          google: {
            outputDimensionality: EMBEDDING_CONFIG.outputDimensionality,
          },
        },
      });

      // Update the review with the generated embedding
      await db
        .update(reviews)
        .set({
          embedding: result.embedding,
          embeddingStatus: "generated",
        })
        .where(eq(reviews.id, reviewId));

      console.log(`Successfully generated embedding for review ${reviewId}`);
    } catch (error) {
      console.error(
        `Failed to generate embedding for review ${reviewId}:`,
        error,
      );

      // Mark the embedding status as failed
      await db
        .update(reviews)
        .set({
          embeddingStatus: "failed",
        })
        .where(eq(reviews.id, reviewId));
    }
  }
}

export const reviewService = new ReviewService();
