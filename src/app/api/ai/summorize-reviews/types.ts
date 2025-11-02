import type { SelectReviewSummary } from "@/database/schemas/reviews";

/**
 * Response for the summarize reviews endpoint.
 */
export interface SummarizeReviewsResponse {
  success: boolean;
  data: SelectReviewSummary;
}

/**
 * Review summary data with additional metadata.
 */
export interface ReviewSummaryData extends SelectReviewSummary {
  reviewCount: number;
}
