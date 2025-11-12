"use client";

import type { CartResponse } from "@/app/api/cart/types";
import { swrFetcher } from "@/lib/swr-fetcher";
import { BASE_URL } from "@/lib/utils";
import { createClientSupabaseClient } from "@/supabase-auth/client";
import type React from "react";
import { useCallback, useEffect } from "react";
import { RecoilRoot, useRecoilState, useSetRecoilState } from "recoil";
import useSWR from "swr";
import { transformCartResponse } from "@/lib/cart-helpers";
import { useAuth } from "@/hooks/use-auth";
import {
  cartState,
  cartDrawerOpenState,
  cartDrawerDirectionState,
  cartLoadingState,
  cartErrorState,
} from "@/state/cart";

/**
 * Internal component that handles cart data fetching and state management
 */
function CartDataManager() {
  const cartUrl = `${BASE_URL}/api/cart`;
  const { isAuthenticated } = useAuth();

  const setCart = useSetRecoilState(cartState);
  const setIsLoading = useSetRecoilState(cartLoadingState);
  const setError = useSetRecoilState(cartErrorState);
  const setIsOpen = useSetRecoilState(cartDrawerOpenState);

  // Use SWR to fetch cart data initially
  const {
    data: cartResponse,
    error,
    isLoading,
    mutate,
  } = useSWR<CartResponse>(isAuthenticated ? cartUrl : null, swrFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // Update Recoil state when SWR data changes
  useEffect(() => {
    setIsLoading(isLoading);
    setError(error || null);

    if (cartResponse) {
      const transformedCart = transformCartResponse(cartResponse);
      setCart(transformedCart);
      // If cart already exists, open the cart
      if (transformedCart) {
        setIsOpen(true);
      }
    }
  }, [
    cartResponse,
    error,
    isLoading,
    setCart,
    setIsLoading,
    setError,
    setIsOpen,
  ]);

  return null;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <CartDataManager />
      {children}
    </RecoilRoot>
  );
}

/**
 * Custom hooks for cart functionality using Recoil
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
