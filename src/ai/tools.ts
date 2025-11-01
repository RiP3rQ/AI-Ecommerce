import { tool, type ToolSet } from "ai";
import z from "zod";
import { findSimilarProducts } from "./tool-helpers/suggest-products";

export function getAiTools(): ToolSet | undefined {
  return {
    suggestProducts: tool({
      description:
        "Suggest products similar to items in the user's cart using AI embeddings",
      inputSchema: z.object({
        cartItems: z.array(
          z.object({
            productId: z.string(),
            productTitle: z.string(),
            productDescription: z.string().nullable(),
            quantity: z.number(),
            tags: z.array(z.string()).nullable(),
          }),
        ),
      }),
      execute: async ({ cartItems }) => {
        const similarProducts = await findSimilarProducts(cartItems);

        return {
          suggestions: similarProducts.map((product) => ({
            id: product.id,
            title: product.title,
            tags: product.tags,
            relevanceScore: product.similarity,
          })),
          totalSuggestions: similarProducts.length,
        };
      },
      outputSchema: z.object({
        suggestions: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            tags: z.array(z.string()).nullable(),
            relevanceScore: z.number(),
          }),
        ),
        totalSuggestions: z.number(),
      }),
    }),
  };
}
