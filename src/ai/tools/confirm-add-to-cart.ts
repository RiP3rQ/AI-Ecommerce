import { tool, zodSchema } from "ai";
import z from "zod";
import { addToCart } from "../tool-helpers/cart-tools";
import { uuidSchema } from "@/app/api/product/[id]/dto";

/**
 * Server-side tool that saves the user's selected product variants to their cart.
 * This is called after the user has confirmed their selections in the client-side modal.
 * The input MUST be the exact output from 'clientSideConfirmationForCartModification'.
 * Supports adding multiple products with different variants in a single operation.
 */
export const saveTheFrontendSelectedProductToCartTool = tool({
  description:
    "[STEP 3 OF 3: Add-to-Cart Flow] Saves the selected product variants and quantities to the user's cart in the database. You MUST pass the exact output from 'clientSideConfirmationForCartModification' as input to this tool (userId and selectedItems). Do not modify the data - use it as-is.",
  inputSchema: zodSchema(
    z.object({
      userId: uuidSchema.describe("User ID from Step 2 output"),
      selectedItems: z
        .array(
          z.object({
            productVariantId: uuidSchema.describe(
              "Variant ID from Step 2 output",
            ),
            quantity: z
              .number()
              .min(1)
              .max(10)
              .describe("Quantity from Step 2 output"),
          }),
        )
        .min(1, "At least one item is required"),
    }),
  ),
  execute: async (args) => {
    const results = await Promise.all(
      args.selectedItems.map(async (item) => {
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
      totalItems: args.selectedItems.length,
      results: results.map((result) => ({
        success: result.success,
        cartItemId: result.cartItemId,
        message: result.message,
      })),
      message: allSuccessful
        ? `Successfully added ${totalItemsAdded} item(s) to cart`
        : `Added ${totalItemsAdded} of ${args.selectedItems.length} item(s) to cart`,
    };
  },
});
