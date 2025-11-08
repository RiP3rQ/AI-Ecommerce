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
    "[STEP 1 OF 3: Add-to-Cart Flow] Gets product details with ALL available variants (sizes, colors, etc.) and prices. Use real product IDs from previous search tools only. This tool returns data that will automatically trigger a modal for the user to select variants and quantities. Do not call any other tools or output text after this - the modal handles all user interaction.",
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
