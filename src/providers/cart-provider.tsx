"use client";

import type { CartResponse } from "@/app/api/cart/types";
import type {
  SelectProductWithoutEmbedding,
  SelectProductVariant,
} from "@/database/schema";
import { swrFetcher } from "@/lib/swr-fetcher";
import { BASE_URL } from "@/lib/utils";
import {
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
} from "@/lib/cart-api";
import type React from "react";
import { useEffect } from "react";
import useSWR from "swr";
import { transformCartResponse } from "@/lib/cart-helpers";
import { useAuth } from "@/hooks/use-auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCart,
  setIsOpen,
  setDirectionOfTheSheet,
  setLoading,
  setError,
  clearCart as clearCartAction,
  openCart as openCartAction,
  closeCart as closeCartAction,
  addItemOptimistically,
  updateItemQuantityOptimistically,
  removeItemOptimistically,
} from "@/store/cart-slice";

type CartContextType = {
  clearCart: () => Promise<void>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  cart: import("@/types/cart").FrontendCart | undefined;
  isLoading: boolean;
  error: Error | null;
  mutate: () => Promise<CartResponse | undefined>;
  addItem: (
    variant: SelectProductVariant,
    product: SelectProductWithoutEmbedding,
    featuredImage?: {
      url: string;
      altText?: string;
      width?: number;
      height?: number;
    },
  ) => Promise<void>;
  updateItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  directionOfTheSheet: "left" | "right";
  setDirectionOfTheSheet: (direction: "left" | "right") => void;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cartUrl = `${BASE_URL}/api/cart`;
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();

  // Use SWR to fetch cart data initially
  const {
    data: cartResponse,
    error: swrError,
    isLoading: swrLoading,
    mutate,
  } = useSWR<CartResponse>(isAuthenticated ? cartUrl : null, swrFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // Update Redux state when SWR data changes
  useEffect(() => {
    if (cartResponse) {
      const transformedCart = transformCartResponse(cartResponse);
      dispatch(setCart(transformedCart));
      // If cart already exists, open the cart
      if (transformedCart) {
        dispatch(setIsOpen(true));
      }
    }
    dispatch(setLoading(swrLoading));
    dispatch(setError(swrError || null));
  }, [cartResponse, swrLoading, swrError, dispatch]);

  return <>{children}</>;
}

/**
 * Custom hook to access the cart state and actions with type safety
 */
export function useCart(): CartContextType {
  const dispatch = useAppDispatch();
  const { cart, isOpen, directionOfTheSheet, isLoading, error } =
    useAppSelector((state) => state.cart);

  const cartUrl = `${BASE_URL}/api/cart`;
  const { isAuthenticated } = useAuth();

  // Use SWR to fetch cart data initially
  const { mutate } = useSWR<CartResponse>(
    isAuthenticated ? cartUrl : null,
    swrFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const addItem = async (
    variant: SelectProductVariant,
    product: SelectProductWithoutEmbedding,
    featuredImage?: {
      url: string;
      altText?: string;
      width?: number;
      height?: number;
    },
  ) => {
    // Check authentication before allowing cart operations
    if (!isAuthenticated) {
      return;
    }

    try {
      // Update Redux state optimistically
      dispatch(addItemOptimistically({ variant, product, featuredImage }));

      // Fire-and-forget add item to cart (will sync on next fetch)
      addItemToCart({
        productVariantId: variant.id,
        quantity: 1,
      }).catch((error) => {
        console.error("Failed to add item to cart:", error);
      });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  };

  const updateItemQuantity = async (cartItemId: string, quantity: number) => {
    // Check authentication before allowing cart operations
    if (!isAuthenticated) {
      return;
    }

    try {
      // Update Redux state optimistically
      dispatch(updateItemQuantityOptimistically({ cartItemId, quantity }));

      // Fire-and-forget update item quantity or remove item if quantity is 0
      if (quantity === 0) {
        removeCartItem({ cartItemId }).catch((error) => {
          console.error("Failed to remove item from cart:", error);
        });
      } else {
        updateCartItemQuantity({ cartItemId, quantity }).catch((error) => {
          console.error("Failed to update item quantity:", error);
        });
      }
    } catch (error) {
      console.error("Failed to update item quantity:", error);
      throw error;
    }
  };

  const removeItem = async (cartItemId: string) => {
    // Check authentication before allowing cart operations
    if (!isAuthenticated) {
      return;
    }

    try {
      // Update Redux state optimistically
      dispatch(removeItemOptimistically(cartItemId));

      // Fire-and-forget remove item from cart
      removeCartItem({ cartItemId }).catch((error) => {
        console.error("Failed to remove item from cart:", error);
      });
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      throw error;
    }
  };

  const clearCartHandler = async () => {
    // Check authentication before allowing cart operations
    if (!isAuthenticated) {
      return;
    }

    // Clear Redux state
    dispatch(clearCartAction());
  };

  const openCartHandler = () => {
    dispatch(openCartAction());
  };

  const closeCartHandler = () => {
    dispatch(closeCartAction());
  };

  const setIsOpenHandler = (isOpen: boolean) => {
    dispatch(setIsOpen(isOpen));
  };

  const setDirectionOfTheSheetHandler = (direction: "left" | "right") => {
    dispatch(setDirectionOfTheSheet(direction));
  };

  return {
    clearCart: clearCartHandler,
    isOpen,
    setIsOpen: setIsOpenHandler,
    cart,
    isLoading,
    error,
    mutate,
    addItem,
    updateItemQuantity,
    removeItem,
    openCart: openCartHandler,
    closeCart: closeCartHandler,
    directionOfTheSheet,
    setDirectionOfTheSheet: setDirectionOfTheSheetHandler,
  };
}
