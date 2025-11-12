"use client";

import { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  cartState,
  cartDrawerOpenState,
  cartDrawerDirectionState,
  cartLoadingState,
  cartErrorState,
  cartTotalQuantityState,
} from "@/state/cart";
import { useCartActions } from "@/state/cart";

/**
 * Hook for accessing cart state and UI controls
 */
export function useCartState() {
  const [cart] = useRecoilState(cartState);
  const [isOpen, setIsOpen] = useRecoilState(cartDrawerOpenState);
  const [direction, setDirection] = useRecoilState(cartDrawerDirectionState);
  const [isLoading] = useRecoilState(cartLoadingState);
  const [error] = useRecoilState(cartErrorState);

  const openCart = useCallback(() => setIsOpen(true), [setIsOpen]);
  const closeCart = useCallback(() => setIsOpen(false), [setIsOpen]);

  return {
    cart,
    isOpen,
    setIsOpen,
    direction,
    setDirection,
    isLoading,
    error,
    openCart,
    closeCart,
  };
}

/**
 * Hook for accessing cart total quantity
 */
export function useCartTotalQuantity() {
  return useRecoilValue(cartTotalQuantityState);
}

/**
 * Hook for cart actions (add, update, remove items)
 */
export function useCartActionsHook() {
  return useCartActions();
}
