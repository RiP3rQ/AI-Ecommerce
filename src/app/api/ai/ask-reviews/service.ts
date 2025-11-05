import { generateText, embed } from "ai";
import { geminiProvider } from "@/ai/gemini-provider";
import { reviews, products } from "@/database/schema";
import { cosineDistance, desc, sql, eq, count } from "drizzle-orm";
import { AskReviewsPrompts } from "./prompts";
import {
  MIN_SIMILARITY_THRESHOLD,
  MAX_REVIEWS_FOR_CONTEXT,
  MAX_ANSWER_TOKENS,
  MIN_REVIEWS_FOR_HIGH_CONFIDENCE,
  HIGH_CONFIDENCE_THRESHOLD,
} from "./constants";
import { ProductNotFoundError } from "@/lib/errors";
import type { DrizzleDbClient } from "@/database/index";
import type { AskReviewsDto } from "./dto";
import type { AnswerData, RelevantReview } from "./types";
import type { TestDatabase } from "@/test/utils/db-helper";

/**
 * Configuration for embedding similarity search.
 */
const EMBEDDING_CONFIG = {
  model: geminiProvider.textEmbeddingModel("gemini-embedding-001"),
  outputDimensionality: 1536,
} as const;

/**
 * Service class for AI-powered review question answering.
 * Uses embeddings to find relevant reviews and generate answers.
 */
export class AskReviewsService {
  /**
   * Answers a question about a product using relevant customer reviews.
   * @param dto - Question and product parameters
   * @returns AI-generated answer with relevant reviews and confidence score
   */
  public async askReviews({
    dto,
    db,
  }: Readonly<{
    dto: AskReviewsDto;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<AnswerData> {
    const { productId, question, maxReviews } = dto;

    // Step 1: Verify product exists
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      throw new ProductNotFoundError();
    }

    // Step 2: Check if product has any reviews
    const [{ totalReviews }] = await db
      .select({ totalReviews: count(reviews.id) })
      .from(reviews)
      .where(eq(reviews.productId, productId));

    if (totalReviews === 0) {
      throw new Error("No reviews found for this product");
    }

    // Step 3: Generate embedding for the question
    const questionEmbedding = await this.generateQuestionEmbedding(question);

    // Step 4: Find relevant reviews using cosine similarity
    const relevantReviews = await this.findRelevantReviews({
      productId,
      questionEmbedding: questionEmbedding.embedding,
      maxReviews: Math.min(maxReviews, MAX_REVIEWS_FOR_CONTEXT),
      db,
    });

    if (relevantReviews.length === 0) {
      throw new Error("No relevant reviews found for this question");
    }

    // Step 5: Calculate average rating for context
    const totalRating = relevantReviews.reduce(
      (sum, review) => sum + parseFloat(review.rating),
      0,
    );
    const averageRating =
      Math.round((totalRating / relevantReviews.length) * 10) / 10;

    // Step 6: Generate AI answer using relevant reviews as context
    const answer = await this.generateAnswer({
      question,
      relevantReviews,
      totalReviews: relevantReviews.length,
      averageRating,
    });

    // Step 7: Calculate confidence score
    const confidence = this.calculateConfidence(relevantReviews);

    return {
      answer,
      relevantReviews,
      confidence,
      totalReviewsFound: totalReviews,
    };
  }

  /**
   * Generates an embedding for the customer's question.
   * @param question - The customer's question
   * @returns Embedding vector
   */
  private async generateQuestionEmbedding(question: string): Promise<{
    embedding: number[];
  }> {
    try {
      const result = await embed({
        model: EMBEDDING_CONFIG.model,
        value: question,
        providerOptions: {
          google: {
            outputDimensionality: EMBEDDING_CONFIG.outputDimensionality,
          },
        },
      });

      return { embedding: result.embedding };
    } catch (error) {
      console.error("Failed to generate question embedding:", error);
      throw new Error("Failed to process the question");
    }
  }

  /**
   * Finds reviews most relevant to the question using cosine similarity.
   * @param params - Search parameters
   * @returns Array of relevant reviews with similarity scores
   */
  private async findRelevantReviews({
    productId,
    questionEmbedding,
    maxReviews,
    db,
  }: Readonly<{
    productId: string;
    questionEmbedding: number[];
    maxReviews: number;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<RelevantReview[]> {
    const similarity = sql<number>`1 - (${cosineDistance(
      reviews.embedding,
      questionEmbedding,
    )})`;

    const relevantReviews = await db
      .select({
        id: reviews.id,
        content: reviews.content,
        rating: reviews.rating,
        similarity,
      })
      .from(reviews)
      .where(
        sql`${eq(reviews.productId, productId)} AND ${similarity} > ${MIN_SIMILARITY_THRESHOLD}`,
      )
      .orderBy(desc(similarity))
      .limit(maxReviews);

    return relevantReviews.map((review) => ({
      id: review.id,
      content: review.content,
      rating: review.rating,
      similarity: Number(review.similarity),
    }));
  }

  /**
   * Generates an AI answer based on relevant reviews.
   * @param params - Answer generation parameters
   * @returns Generated answer text
   */
  private async generateAnswer({
    question,
    relevantReviews,
    totalReviews,
    averageRating,
  }: Readonly<{
    question: string;
    relevantReviews: RelevantReview[];
    totalReviews: number;
    averageRating: number;
  }>): Promise<string> {
    // Prepare reviews text for AI context
    const reviewsText = relevantReviews
      .map((review) => `[${review.rating} stars] ${review.content}`)
      .join("\n\n");

    try {
      const aiResponse = await generateText({
        model: geminiProvider("gemini-2.5-flash"),
        system: AskReviewsPrompts.SYSTEM_PROMPT,
        prompt: AskReviewsPrompts.USER_PROMPT({
          question,
          reviewsText,
          totalReviews,
          averageRating,
        }),
        temperature: 0.3, // Balanced creativity and consistency
        maxOutputTokens: MAX_ANSWER_TOKENS,
      });

      const answer = aiResponse.text?.trim();

      if (!answer) {
        throw new Error("AI returned empty answer");
      }

      return answer;
    } catch (error) {
      console.error("Failed to generate answer:", error);
      throw new Error(
        `Failed to generate answer: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Calculates confidence level based on review relevance and quantity.
   * @param relevantReviews - Reviews found with similarity scores
   * @returns Confidence level
   */
  private calculateConfidence(
    relevantReviews: RelevantReview[],
  ): "high" | "medium" | "low" {
    const avgSimilarity =
      relevantReviews.reduce((sum, review) => sum + review.similarity, 0) /
      relevantReviews.length;

    const hasHighSimilarity = relevantReviews.some(
      (review) => review.similarity > HIGH_CONFIDENCE_THRESHOLD,
    );

    const hasEnoughReviews =
      relevantReviews.length >= MIN_REVIEWS_FOR_HIGH_CONFIDENCE;

    if (hasHighSimilarity && hasEnoughReviews) {
      return "high";
    } else if (
      avgSimilarity > MIN_SIMILARITY_THRESHOLD &&
      relevantReviews.length > 0
    ) {
      return "medium";
    } else {
      return "low";
    }
  }
}

export const askReviewsService = new AskReviewsService();
