import { tool, zodSchema } from "ai";
import z from "zod";
import { getProductsByCategory } from "../tool-helpers/product-tools";

export const getProductsByCategoryTool = tool({
  description: "Get all products from a specific category",
  inputSchema: zodSchema(
    z.object({
      categoryName: z.string().min(1, "Category name cannot be empty"),
      limit: z.number().min(1).max(50).default(20).optional(),
    }),
  ),
  execute: async (args) => {
    const products = await getProductsByCategory(
      args.categoryName,
      args.limit || 20,
    );

    return {
      products: products.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        tags: product.tags,
      })),
      totalProducts: products.length,
      categoryName: args.categoryName,
    };
  },
});
