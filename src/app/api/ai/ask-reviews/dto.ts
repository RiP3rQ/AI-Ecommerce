import { z } from "zod";
import { uuidSchema } from "../../product/[id]/dto";

/**
 * Schema for asking questions about product reviews.
 */
export const askReviewsSchema = z.object({
  productId: uuidSchema,
  question: z
    .string()
    .min(5, "Question must be at least 5 characters long")
    .max(500, "Question cannot exceed 500 characters"),
  maxReviews: z
    .number()
    .int()
    .min(1, "Must include at least 1 review")
    .max(20, "Cannot include more than 20 reviews")
    .optional()
    .default(5),
});

export type AskReviewsDto = z.infer<typeof askReviewsSchema>;
