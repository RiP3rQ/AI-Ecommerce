import { tool, zodSchema } from "ai";
import z from "zod";
import { getProductDetails } from "../tool-helpers/product-tools";
import { uuidSchema } from "@/app/api/product/[id]/dto";

export const getProductDetailsTool = tool({
  description:
    "Get detailed information about a specific product including reviews and category",
  inputSchema: zodSchema(
    z.object({
      productId: uuidSchema,
    }),
  ),
  execute: async (args) => {
    const product = await getProductDetails(args.productId);

    if (!product) {
      return { product: null, found: false };
    }

    return {
      product: {
        id: product.id,
        title: product.title,
        description: product.description,
        tags: product.tags,
        category: product.category,
        reviewSummary: product.reviewSummary,
        averageRating: product.averageRating,
        reviewCount: product.reviewCount,
      },
      found: true,
    };
  },
});
