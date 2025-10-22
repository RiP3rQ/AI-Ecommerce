import { z } from "zod";
import { uuidSchema } from "../product/[id]/dto";

/**
 * Schema for adding an item to the cart.
 */
export const addItemToCartSchema = z.object({
  productVariantId: uuidSchema,
  quantity: z.number().int().min(1, "Quantity must be at least 1."),
});

export type AddItemToCartDto = z.infer<typeof addItemToCartSchema>;

/**
 * Schema for updating cart item quantity.
 */
export const updateCartItemSchema = z.object({
  cartItemId: uuidSchema,
  quantity: z.number().int().min(1, "Quantity must be at least 1."),
});

export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>;

/**
 * Schema for removing an item from the cart.
 */
export const removeCartItemSchema = z.object({
  cartItemId: uuidSchema,
});

export type RemoveCartItemDto = z.infer<typeof removeCartItemSchema>;
