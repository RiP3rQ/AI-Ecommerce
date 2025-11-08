import { tool, zodSchema } from "ai";
import z from "zod";
import { getMostLikedProducts } from "../tool-helpers/product-tools";

export const getMostLikedProductsTool = tool({
  description:
    "Get the most liked products based on customer reviews and ratings",
  inputSchema: zodSchema(
    z.object({
      limit: z.number().min(1).max(50).default(10).optional(),
    }),
  ),
  execute: async (args) => {
    const products = await getMostLikedProducts(args.limit || 10);

    return {
      products: products.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        tags: product.tags,
        averageRating: product.averageRating,
        reviewCount: product.reviewCount,
      })),
      totalProducts: products.length,
    };
  },
});
