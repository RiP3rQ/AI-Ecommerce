import { tool, zodSchema } from "ai";
import z from "zod";
import { addToCart } from "../tool-helpers/cart-tools";
import { uuidSchema } from "@/app/api/product/[id]/dto";

export const confirmAddToCartTool = tool({
  description:
    "Confirm and add the selected product variant to the user's cart",
  inputSchema: zodSchema(
    z.object({
      userId: uuidSchema,
      productVariantId: uuidSchema,
      quantity: z.number().min(1).max(10).default(1),
    }),
  ),
  execute: async (args) => {
    const result = await addToCart(
      args.userId,
      args.productVariantId,
      args.quantity,
    );

    return {
      success: result.success,
      cartId: result.cartId,
      cartItemId: result.cartItemId,
      message: result.message,
    };
  },
});
