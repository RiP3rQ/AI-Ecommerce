/**
 * Client-side cart API utilities.
 * These functions call the cart API endpoints from the browser.
 */

import type {
  CartResponse,
  DeleteCartItemResponse,
} from "@/app/api/cart/types";

/**
 * Adds an item to the cart.
 */
export async function addItemToCart({
  productVariantId,
  quantity,
}: {
  productVariantId: string;
  quantity: number;
}): Promise<CartResponse> {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productVariantId,
      quantity,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Failed to add item to cart",
    }));
    throw new Error(error.message || "Failed to add item to cart");
  }

  return response.json();
}

/**
 * Updates the quantity of a cart item.
 */
export async function updateCartItemQuantity({
  cartItemId,
  quantity,
}: {
  cartItemId: string;
  quantity: number;
}): Promise<CartResponse> {
  const response = await fetch("/api/cart", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cartItemId,
      quantity,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Failed to update item quantity",
    }));
    throw new Error(error.message || "Failed to update item quantity");
  }

  return response.json();
}

/**
 * Removes an item from the cart.
 */
export async function removeCartItem({
  cartItemId,
}: {
  cartItemId: string;
}): Promise<DeleteCartItemResponse> {
  const response = await fetch("/api/cart", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cartItemId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Failed to remove item from cart",
    }));
    throw new Error(error.message || "Failed to remove item from cart");
  }

  return response.json();
}

/**
 * Gets the current cart.
 */
export async function getCartFromApi(): Promise<CartResponse> {
  const response = await fetch("/api/cart", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Failed to fetch cart",
    }));
    throw new Error(error.message || "Failed to fetch cart");
  }

  return response.json();
}
