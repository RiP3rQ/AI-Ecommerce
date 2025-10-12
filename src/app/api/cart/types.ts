import type { SelectCart, SelectCartItem } from "@/database/schemas/cart";
import type { SelectProductVariant } from "@/database/schemas/product-variants";
import type { SelectProduct } from "@/database/schemas/products";

/**
 * Cart item with full product and variant details.
 */
export interface CartItemWithDetails extends SelectCartItem {
  productVariant: SelectProductVariant & {
    product: SelectProduct;
  };
}

/**
 * Full cart with items and product details.
 */
export interface CartWithItems extends SelectCart {
  items: CartItemWithDetails[];
}

/**
 * Cart summary for API responses.
 */
export interface CartSummary {
  cart: CartWithItems;
  totalItems: number;
  totalPrice: number;
  currencyCode: string;
}

/**
 * Response for cart operations.
 */
export interface CartResponse {
  success: boolean;
  data: CartSummary;
}

/**
 * Response for delete operations.
 */
export interface DeleteCartItemResponse {
  success: boolean;
  data: CartSummary;
  message: string;
}
