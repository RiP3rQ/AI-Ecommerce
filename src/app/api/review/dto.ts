import { z } from "zod";
import { uuidSchema } from "../product/[id]/dto";

/**
 * Schema for creating a new review.
 */
export const createReviewSchema = z.object({
  productId: uuidSchema,
  content: z
    .string()
    .min(10, "Review must be at least 10 characters long")
    .max(1000, "Review cannot exceed 1000 characters"),
  rating: z
    .number()
    .min(0.5, "Rating must be at least 0.5")
    .max(5, "Rating cannot exceed 5 stars"),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;

/**
 * Schema for fetching reviews with pagination and filtering.
 */
export const getReviewsSchema = z.object({
  // Pagination
  page: z
    .number()
    .int()
    .min(1, "Page must be at least 1.")
    .optional()
    .default(1),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1.")
    .max(100, "Limit cannot exceed 100.")
    .optional()
    .default(20),

  // Filtering
  productId: uuidSchema,
});

export type GetReviewsDto = z.infer<typeof getReviewsSchema>;
