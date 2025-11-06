import { tool, zodSchema } from "ai";
import z from "zod";
import { searchProductsByTags } from "../tool-helpers/product-tools";

export const searchProductsByTagsTool = tool({
  description:
    "Search for products by tags (e.g., 'hoodie', 'black', 'cotton')",
  inputSchema: zodSchema(
    z.object({
      tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
      limit: z.number().min(1).max(50).default(20).optional(),
    }),
  ),
  execute: async (args) => {
    const products = await searchProductsByTags(args.tags, args.limit || 20);

    return {
      products: products.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        tags: product.tags,
      })),
      totalProducts: products.length,
      searchedTags: args.tags,
    };
  },
});
