import { tool, zodSchema } from "ai";
import z from "zod";
import { getProductReviews } from "../tool-helpers/product-tools";

export const getProductReviewsTool = tool({
  description: "Get customer reviews for a specific product",
  inputSchema: zodSchema(
    z.object({
      productId: z.string().uuid("Invalid product ID format"),
      limit: z.number().min(1).max(20).default(5).optional(),
    }),
  ),
  execute: async (args) => {
    const reviews = await getProductReviews(args.productId, args.limit || 5);

    return {
      reviews: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        content: review.content,
        createdAt: review.createdAt.toISOString(),
      })),
      totalReviews: reviews.length,
      productId: args.productId,
    };
  },
});
