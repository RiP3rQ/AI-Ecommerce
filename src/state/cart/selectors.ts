"use client";

import { selector } from "recoil";
import type { CartResponse } from "@/app/api/cart/types";
import { cartState } from "./atoms";

/**
 * Selector for fetching cart data from API
 */
export const cartQuery = selector<CartResponse | undefined>({
  key: "cartQuery",
  get: async () => {
    // Note: This selector would need access to auth state
    // For now, we'll handle this in the provider
    return undefined;
  },
});

/**
 * Selector for total cart quantity
 */
export const cartTotalQuantityState = selector<number>({
  key: "cartTotalQuantityState",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart?.totalQuantity || 0;
  },
});

/**
 * Selector for total cart amount
 */
export const cartTotalAmountState = selector<string>({
  key: "cartTotalAmountState",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart?.cost.totalAmount.amount || "0";
  },
});

/**
 * Selector for cart currency
 */
export const cartCurrencyState = selector<string>({
  key: "cartCurrencyState",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart?.cost.totalAmount.currencyCode || "USD";
  },
});

/**
 * Selector for cart item count
 */
export const cartItemCountState = selector<number>({
  key: "cartItemCountState",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart?.lines.length || 0;
  },
});

/**
 * Selector for checking if cart is empty
 */
export const isCartEmptyState = selector<boolean>({
  key: "isCartEmptyState",
  get: ({ get }) => {
    const cart = get(cartState);
    return !cart || cart.lines.length === 0;
  },
});
