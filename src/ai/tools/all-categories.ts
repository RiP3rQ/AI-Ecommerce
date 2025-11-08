import { tool, zodSchema } from "ai";
import z from "zod";
import { getAllCategories } from "../tool-helpers/product-tools";

export const getAllCategoriesTool = tool({
  description:
    "Get all available product categories in the store, like 'Hoodies', 'Shirts', 'Pants', 'Shoes', 'Accessories', etc.",
  inputSchema: zodSchema(z.object({})),
  execute: async () => {
    const categories = await getAllCategories();

    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
      })),
      totalCategories: categories.length,
    };
  },
});
