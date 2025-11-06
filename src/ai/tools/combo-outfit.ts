import { tool, zodSchema } from "ai";
import z from "zod";
import { findOutfitCombinations } from "../tool-helpers/combo-outfit";
import { uuidSchema } from "@/app/api/product/[id]/dto";

export const comboOutfitTool = tool({
  description:
    "Suggest outfit combinations (pants, shoes, accessories) that match a given base item like a hoodie or shirt",
  inputSchema: zodSchema(
    z.object({
      baseProductId: uuidSchema,
      baseProductTitle: z.string().min(1, "Base product title cannot be empty"),
    }),
  ),
  execute: async (args) => {
    const outfitCombinations = await findOutfitCombinations({
      productId: args.baseProductId,
      productTitle: args.baseProductTitle,
    });

    // Group suggestions by category
    const groupedSuggestions = outfitCombinations.reduce(
      (acc, product) => {
        const category = product.outfitCategory;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push({
          id: product.id,
          title: product.title,
          description: product.description,
          tags: product.tags,
          relevanceScore: product.similarity,
        });
        return acc;
      },
      {} as Record<
        string,
        Array<{
          id: string;
          title: string;
          description?: string | null;
          tags: string[] | null;
          relevanceScore: number;
        }>
      >,
    );

    return {
      baseProduct: {
        id: args.baseProductId,
        title: args.baseProductTitle,
      },
      suggestions: groupedSuggestions,
      totalSuggestions: outfitCombinations.length,
      categories: Object.keys(groupedSuggestions),
    };
  },
});
