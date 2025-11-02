import type { SelectReview } from "@/database/schemas/reviews";

/**
 * Review with user information.
 */
export interface ReviewWithUser extends Omit<SelectReview, "embedding"> {
  user: {
    id: string;
    email: string;
  };
}

/**
 * Pagination metadata for review list responses.
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Review list response data.
 */
export interface ReviewsData {
  reviews: ReviewWithUser[];
  pagination: PaginationMeta;
}

/**
 * Response for reviews endpoint.
 */
export interface ReviewsResponse {
  success: boolean;
  data: ReviewsData;
}

/**
 * Response for creating a review.
 */
export interface CreateReviewResponse {
  success: boolean;
  data: SelectReview;
}
