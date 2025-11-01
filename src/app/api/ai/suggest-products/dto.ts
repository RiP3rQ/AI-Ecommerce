import { z } from "zod";

/**
 * Schema for cart item data used in product suggestions.
 */
export const cartItemForSuggestionSchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
  productTitle: z.string().min(1, "Product title is required"),
  productDescription: z.string().nullable(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  tags: z.array(z.string()).nullable(),
});

export type CartItemForSuggestion = z.infer<typeof cartItemForSuggestionSchema>;

/**
 * Schema for suggest products request.
 */
export const suggestProductsSchema = z.object({
  cartItems: z
    .array(cartItemForSuggestionSchema)
    .min(1, "At least one cart item is required"),
  maxSuggestions: z.number().int().min(1).max(10).optional().default(5),
});

export type SuggestProductsDto = z.infer<typeof suggestProductsSchema>;
