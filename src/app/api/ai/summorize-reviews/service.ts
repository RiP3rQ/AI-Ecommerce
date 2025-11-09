import { AiSdkHandler } from "@/ai/ai-sdk";
import { geminiProvider } from "@/ai/gemini-provider";
import { reviewSummaries, reviews, products } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import { SummarizeReviewsPrompts } from "./prompts";
import { MAX_REVIEWS_FOR_SUMMARY, MAX_SUMMARY_TOKENS } from "./constants";
import { ProductNotFoundError } from "@/lib/errors";
import type { DrizzleDbClient } from "@/database/index";
import type { SummarizeReviewsDto } from "./dto";
import type { ReviewSummaryData } from "./types";
import type { TestDatabase } from "@/test/utils/db-helper";

/**
 * Service class for AI-powered review summarization.
 * Generates and manages product review summaries using AI.
 */
export class SummarizeReviewsService {
  /**
   * Generates or updates a summary for all reviews of a product.
   * @param dto - Request parameters containing productId
   * @returns Generated or updated review summary
   */
  public async summarizeReviews({
    dto,
    db,
  }: Readonly<{
    dto: SummarizeReviewsDto;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<ReviewSummaryData> {
    const { productId } = dto;

    // Step 1: Verify product exists
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      throw new ProductNotFoundError();
    }

    // Step 2: Fetch reviews for the product
    const productReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        content: reviews.content,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt))
      .limit(MAX_REVIEWS_FOR_SUMMARY);

    if (productReviews.length === 0) {
      throw new Error("No reviews found for this product");
    }

    // Step 3: Calculate average rating
    const totalReviews = productReviews.length;
    const averageRating =
      productReviews.reduce((sum, review) => {
        const rating = parseFloat(review.rating);
        return sum + (isNaN(rating) ? 0 : rating);
      }, 0) / totalReviews;

    // Step 4: Prepare reviews text for AI
    const reviewsText = productReviews
      .map((review) => `[${review.rating} stars] ${review.content}`)
      .join("\n\n");

    // Step 5: Generate summary using AI
    const summary = await this.generateReviewSummary({
      reviewsText,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews,
      db,
      productId,
    });

    // Step 6: Store or update summary in database
    const [summaryRecord] = await db
      .insert(reviewSummaries)
      .values({
        productId,
        summary,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: reviewSummaries.productId,
        set: {
          summary,
          updatedAt: new Date(),
        },
      })
      .returning();

    return {
      ...summaryRecord,
      reviewCount: totalReviews,
    };
  }

  /**
   * Generates a review summary using AI.
   * @param reviewsText - Concatenated review texts
   * @param averageRating - Average rating across all reviews
   * @param totalReviews - Total number of reviews
   * @param db - Database client for saving AI results
   * @param productId - Product ID for operation tracking
   * @returns Generated summary text
   */
  private async generateReviewSummary({
    reviewsText,
    averageRating,
    totalReviews,
    db,
    productId,
  }: Readonly<{
    reviewsText: string;
    averageRating: number;
    totalReviews: number;
    db: DrizzleDbClient | TestDatabase;
    productId: string;
  }>): Promise<string> {
    try {
      const aiResponse = await AiSdkHandler.generateText(
        {
          system: SummarizeReviewsPrompts.SYSTEM_PROMPT,
          prompt: SummarizeReviewsPrompts.USER_PROMPT({
            reviewsText,
            averageRating,
            totalReviews,
          }),
          temperature: 0.3, // Balanced creativity and consistency
          maxOutputTokens: MAX_SUMMARY_TOKENS,
        },
        {
          dbClient: db,
          operationType: "summarize_reviews",
          operationId: productId,
        },
      );

      const summary = aiResponse.text?.trim();

      if (!summary) {
        throw new Error("AI returned empty summary");
      }

      return summary;
    } catch (error) {
      console.error("Failed to generate review summary:", error);
      throw new Error(
        `Failed to generate review summary: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

export const summarizeReviewsService = new SummarizeReviewsService();
