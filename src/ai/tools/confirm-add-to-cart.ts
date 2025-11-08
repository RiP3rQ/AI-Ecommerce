import { tool, zodSchema } from "ai";
import z from "zod";
import { addToCart } from "../tool-helpers/cart-tools";
import { uuidSchema } from "@/app/api/product/[id]/dto";

/**
 * Server-side tool that saves the user's selected product variants to their cart.
 * This is called after the user has confirmed their selections in the client-side modal.
 * Supports adding multiple products with different variants in a single operation.
 */
export const saveTheFrontendSelectedProductToCartTool = tool({
  description:
    "[STEP 3 OF 3: Add-to-Cart Flow] Saves the selected product variants and quantities to the user's cart in the database. Called automatically after user confirms in the modal. Can add multiple items at once.",
  inputSchema: zodSchema(
    z.object({
      userId: uuidSchema,
      items: z
        .array(
          z.object({
            productVariantId: uuidSchema,
            quantity: z.number().min(1).max(10).default(1),
          }),
        )
        .min(1, "At least one item is required"),
    }),
  ),
  execute: async (args) => {
    const results = await Promise.all(
      args.items.map(async (item) => {
        const result = await addToCart(
          args.userId,
          item.productVariantId,
          item.quantity,
        );
        return result;
      }),
    );

    const allSuccessful = results.every((result) => result.success);
    const totalItemsAdded = results.filter((result) => result.success).length;

    return {
      success: allSuccessful,
      itemsAdded: totalItemsAdded,
      totalItems: args.items.length,
      results: results.map((result) => ({
        success: result.success,
        cartItemId: result.cartItemId,
        message: result.message,
      })),
      message: allSuccessful
        ? `Successfully added ${totalItemsAdded} item(s) to cart`
        : `Added ${totalItemsAdded} of ${args.items.length} item(s) to cart`,
    };
  },
});
