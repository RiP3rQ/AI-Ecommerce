"use client";

import { atom } from "recoil";
import type { FrontendCart } from "@/types/cart";

/**
 * Atom for storing the cart data
 */
export const cartState = atom<FrontendCart | undefined>({
  key: "cartState",
  default: undefined,
});

/**
 * Atom for controlling the cart drawer open/close state
 */
export const cartDrawerOpenState = atom<boolean>({
  key: "cartDrawerOpenState",
  default: false,
});

/**
 * Atom for controlling the cart drawer direction
 */
export const cartDrawerDirectionState = atom<"left" | "right">({
  key: "cartDrawerDirectionState",
  default: "right",
});

/**
 * Atom for tracking cart loading state
 */
export const cartLoadingState = atom<boolean>({
  key: "cartLoadingState",
  default: false,
});

/**
 * Atom for storing cart error state
 */
export const cartErrorState = atom<Error | null>({
  key: "cartErrorState",
  default: null,
});
