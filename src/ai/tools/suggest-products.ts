import { tool, zodSchema } from "ai";
import z from "zod";
import { findSimilarProducts } from "../tool-helpers/suggest-products";

export const suggestProductsTool = tool({
  description:
    "Suggest products similar to items in the user's cart using AI embeddings",
  inputSchema: zodSchema(
    z.object({
      cartItems: z.array(
        z.object({
          productId: z.string().uuid("Invalid product ID format"),
          quantity: z.number(),
          productTitle: z.string(),
        }),
      ),
    }),
  ),
  execute: async (args) => {
    const similarProducts = await findSimilarProducts(args.cartItems);

    return {
      suggestions: similarProducts.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        tags: product.tags,
        relevanceScore: product.similarity,
      })),
      totalSuggestions: similarProducts.length,
    };
  },
});
