import { tool, zodSchema } from "ai";
import z from "zod";
import { getCartDetails } from "../tool-helpers/cart-tools";
import { uuidSchema } from "@/app/api/product/[id]/dto";

export const getCartDetailsTool = tool({
  description:
    "Get detailed information about the user's shopping cart including all items, quantities, and product details",
  inputSchema: zodSchema(
    z
      .object({
        userId: z
          .string()
          .optional()
          .describe(
            "(Optional) The user's ID. If not provided, it will be provided by the experimental_context.",
          ),
      })
      .optional(),
  ),
  execute: async (args, options) => {
    const userIdFromArgs = args?.userId;
    const userIdFromContext =
      (options.experimental_context as { userId: string })?.userId ??
      userIdFromArgs;

    if (!userIdFromContext) {
      return {
        cart: null,
        found: false,
        message: "No user ID provided",
      };
    }

    const cart = await getCartDetails(userIdFromContext);

    if (!cart) {
      return {
        cart: null,
        found: false,
        message: "No cart found for this user",
      };
    }

    return {
      cart: {
        id: cart.id,
        userId: cart.userId,
        items: cart.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          productVariant: {
            id: item.productVariant.id,
            title: item.productVariant.title,
            price: item.productVariant.price,
            currencyCode: item.productVariant.currencyCode,
            availableForSale: item.productVariant.availableForSale,
            selectedOptions: item.productVariant.selectedOptions,
            product: {
              id: item.productVariant.product.id,
              title: item.productVariant.product.title,
              description: item.productVariant.product.description,
              tags: item.productVariant.product.tags,
            },
          },
        })),
        itemCount: cart.itemCount,
        totalItems: cart.totalItems,
      },
      found: true,
    };
  },
});
