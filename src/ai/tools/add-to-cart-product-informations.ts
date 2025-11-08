import { tool, zodSchema } from "ai";
import z from "zod";
import { uuidSchema } from "@/app/api/product/[id]/dto";
import { getProductDetailsWithVariants } from "../tool-helpers/product-tools";

/**
 * Server-side tool that must be called before client-side confirmation tool.
 * Returns product details with ALL available variants and prices.
 * This allows the frontend to display a modal with variant selection options (size, color, etc.).
 */
export const addToCartProductInformationsTool = tool({
  description:
    "[Step 1: Call BEFORE clientSideConfirmationForCartModification] Gets product details with ALL available variants (sizes, colors, etc.) and prices for specific products. Use product IDs that you obtained from previous tool calls (like search tools). Do NOT make up product IDs - they must exist in the database. The frontend will show these options to the user in a modal.",
  inputSchema: zodSchema(
    z.object({
      products: z
        .array(
          z.object({
            productId: uuidSchema.describe(
              "The ID of the product to get details for. Use product IDs from previous tool calls (like search tools) and ensure they exist before calling this tool.",
            ),
          }),
        )
        .min(1, "At least one product is required"),
    }),
  ),
  execute: async (args) => {
    const productIds = args.products.map((item) => item.productId);
    const productsWithVariants =
      await getProductDetailsWithVariants(productIds);

    // Check if all requested products were found
    const foundProductIds = productsWithVariants.map((p) => p.id);
    const missingProducts = productIds.filter(
      (id) => !foundProductIds.includes(id),
    );

    if (missingProducts.length > 0) {
      throw new Error(
        `The following product IDs were not found in the database: ${missingProducts.join(", ")}. Please use product IDs from previous tool calls (like search tools) and ensure they exist before calling this tool.`,
      );
    }

    return {
      products: productsWithVariants,
    };
  },
});
