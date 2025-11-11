import { tool, zodSchema } from "ai";
import z from "zod";
import { removeFromCart } from "../tool-helpers/cart-tools";

export const removeFromCartTool = tool({
  description:
    "Remove items from the user's shopping cart. Requires user approval before execution. This tool will find and remove cart items matching the specified product IDs and quantities.",
  inputSchema: zodSchema(
    z.object({
      userId: z
        .string()
        .optional()
        .describe(
          "(Optional) The user's ID. If not provided, it will be provided by the experimental_context.",
        ),
      items: z
        .array(
          z.object({
            productId: z
              .string()
              .min(1, "Product ID is required")
              .describe("The unique identifier of the product to remove"),
            productTitle: z
              .string()
              .min(1, "Product title is required")
              .describe("The display title of the product to remove"),
            variantTitle: z
              .string()
              .min(1, "Variant title is required")
              .describe("The display title of the variant to remove"),
            variantPrice: z
              .number()
              .min(1, "Variant price is required")
              .describe("The price of the variant to remove"),
            variantCurrencyCode: z
              .string()
              .min(1, "Variant currency code is required")
              .describe("The currency code of the variant to remove"),
            quantity: z
              .number()
              .int()
              .min(1, "Quantity must be at least 1")
              .describe("The quantity of this product to remove from the cart"),
          }),
        )
        .min(1, "At least one item must be specified for removal"),
    }),
  ),
  needsApproval: true, // Required for client-side approval functionality
  execute: async (args, options) => {
    const { userId, items } = args;

    const userIdFromContext =
      (options.experimental_context as { userId: string })?.userId ?? userId;

    if (!userIdFromContext) {
      throw new Error("No user ID provided");
    }

    if (!items || items.length === 0) {
      throw new Error("No items specified for removal");
    }

    // Extract productIds and quantities for the helper function
    const productIds = items.map((item) => item.productId);
    const quantities = items.map((item) => item.quantity);

    return await removeFromCart(userIdFromContext, productIds, quantities);
  },
});
