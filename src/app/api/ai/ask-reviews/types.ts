/**
 * Relevant review with similarity score.
 */
export interface RelevantReview {
  id: string;
  content: string;
  rating: string;
  similarity: number;
}

/**
 * Response for the ask-reviews endpoint.
 */
export interface AskReviewsResponse {
  success: boolean;
  data: {
    answer: string;
    relevantReviews: RelevantReview[];
    confidence: "high" | "medium" | "low";
    totalReviewsFound: number;
  };
}

/**
 * Answer data with metadata.
 */
export interface AnswerData {
  answer: string;
  relevantReviews: RelevantReview[];
  confidence: "high" | "medium" | "low";
  totalReviewsFound: number;
}
