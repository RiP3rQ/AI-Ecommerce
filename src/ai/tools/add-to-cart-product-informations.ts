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
    "[Step 1: Always call BEFORE clientSideConfirmationForCartModification] Gets product details with ALL available variants (sizes, colors, etc.) and prices. The frontend will show these options to the user in a modal.",
  inputSchema: zodSchema(
    z.array(
      z.object({
        productId: uuidSchema,
        productTitle: z.string().min(1, "Product title cannot be empty"),
      }),
    ),
  ),
  execute: async (args) => {
    const productIds = args.map((item) => item.productId);
    const productsWithVariants = await getProductDetailsWithVariants(productIds);
    return {
      products: productsWithVariants,
    };
  },
});