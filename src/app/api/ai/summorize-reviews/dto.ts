import { z } from "zod";
import { uuidSchema } from "../../product/[id]/dto";

/**
 * Schema for requesting a review summary for a product.
 */
export const summarizeReviewsSchema = z.object({
  productId: uuidSchema,
});

export type SummarizeReviewsDto = z.infer<typeof summarizeReviewsSchema>;
