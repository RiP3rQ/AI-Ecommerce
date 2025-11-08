import { tool, zodSchema } from "ai";
import z from "zod";
import { searchProductsByName } from "../tool-helpers/product-tools";

export const searchProductsByNameTool = tool({
  description:
    "Search for products by name, description, or keywords. Supports multi-word queries where all words must be present (e.g., 'green hoodie' will find 'Comfy Green Pullover Hoodie')",
  inputSchema: zodSchema(
    z.object({
      query: z.string().min(1, "Search query cannot be empty"),
      limit: z.number().min(1).max(50).default(20).optional(),
    }),
  ),
  execute: async (args) => {
    const products = await searchProductsByName(args.query, args.limit || 20);

    return {
      products: products.map(
        (product: {
          id: string;
          title: string;
          description?: string | null;
          tags: string[] | null;
        }) => ({
          id: product.id,
          title: product.title,
          description: product.description,
          tags: product.tags,
        }),
      ),
      totalProducts: products.length,
      searchQuery: args.query,
    };
  },
});
