import { uuidSchema } from "@/app/api/product/[id]/dto";
import { tool, zodSchema } from "ai";
import z from "zod";

/**
 * Client-side tool that triggers the variant selection modal.
 * This tool is executed on the frontend and allows the user to:
 * - Choose product variants (size, color, etc.)
 * - Select quantity for each product
 * - Confirm or cancel the addition to cart
 *
 * After user selection, the frontend will call saveTheFrontendSelectedProductToCart
 * with the selected variant IDs and quantities.
 */
export const clientSideConfirmationForCartModificationTool = tool({
  description:
    "[Step 2: Call AFTER addToCartProductInformations] Shows a modal to the user with variant options (sizes, colors, etc.) for each product. User selects variants and quantities. Returns selected productVariantId and quantity for each item.",
  inputSchema: zodSchema(
    z.array(
      z.object({
        productId: uuidSchema,
        productTitle: z.string().min(1, "Product title cannot be empty"),
        availableVariants: z.array(
          z.object({
            variantId: uuidSchema,
            variantTitle: z.string(),
            price: z.number(),
            currencyCode: z.string(),
            availableForSale: z.boolean(),
            selectedOptions: z.array(
              z.object({
                name: z.string(),
                value: z.string(),
              }),
            ),
          }),
        ),
      }),
    ),
  ),
  // NO execute function - this is handled on the client-side
  // Frontend shows modal and returns: { productVariantId, quantity }[] for each selected variant
});
