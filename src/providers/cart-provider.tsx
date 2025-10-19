"use client";

import { CartResponse } from "@/app/api/cart/types";
import { SelectProduct, SelectProductVariant } from "@/database/schema";
import { swrFetcher } from "@/lib/swr-fetcher";
import { BASE_URL } from "@/lib/utils";
import { FrontendCart, SelectCartItem } from "@/types/cart";
import {
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
} from "@/lib/cart-api";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { transformCartResponse } from "@/lib/cart-helpers";

type CartContextType = {
  cart: FrontendCart | undefined;
  isLoading: boolean;
  error: Error | null;
  addItem: (
    variant: SelectProductVariant,
    product: SelectProduct,
    featuredImage?: {
      url: string;
      altText?: string;
      width?: number;
      height?: number;
    },
  ) => Promise<void>;
  updateItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cartUrl = `${BASE_URL}/api/cart`;

  // Use SWR to fetch cart data initially
  const {
    data: cartResponse,
    error,
    isLoading,
  } = useSWR<CartResponse>(cartUrl, swrFetcher);

  // Local cart state that gets updated when we make changes
  const [cart, setCart] = useState<FrontendCart | undefined>(
    cartResponse ? transformCartResponse(cartResponse) : undefined,
  );

  // Update local state when SWR data changes (initial load)
  useEffect(() => {
    if (cartResponse && !cart) {
      setCart(transformCartResponse(cartResponse));
    }
  }, [cartResponse, cart]);

  const addItem = async (
    variant: SelectProductVariant,
    product: SelectProduct,
    featuredImage?: {
      url: string;
      altText?: string;
      width?: number;
      height?: number;
    },
  ) => {
    try {
      await addItemToCart({
        productVariantId: variant.id,
        quantity: 1,
      });

      // Update local cart state
      setCart((currentCart) => {
        if (!currentCart) return currentCart;

        const existingItem = currentCart.lines.find(
          (item) => item.merchandise.id === variant.id,
        );

        let updatedLines: SelectCartItem[];

        if (existingItem) {
          // Update existing item quantity
          updatedLines = currentCart.lines.map((item) =>
            item.merchandise.id === variant.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  cost: {
                    ...item.cost,
                    totalAmount: {
                      ...item.cost.totalAmount,
                      amount: (
                        (Number(item.cost.totalAmount.amount) / item.quantity) *
                        (item.quantity + 1)
                      ).toString(),
                    },
                  },
                }
              : item,
          );
        } else {
          // Add new item
          const newItem: SelectCartItem = {
            id: `temp-${Date.now()}`, // Temporary ID, will be updated on next fetch
            quantity: 1,
            cost: {
              totalAmount: {
                amount: (variant.price / 100).toString(),
                currencyCode: variant.currencyCode,
              },
            },
            merchandise: {
              id: variant.id,
              title: variant.title,
              selectedOptions: variant.selectedOptions,
              product: {
                id: product.id,
                handle: product.id,
                title: product.title,
                featuredImage: featuredImage || null,
              },
            },
          };
          updatedLines = [...currentCart.lines, newItem];
        }

        // Update totals
        const totalQuantity = updatedLines.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const totalAmount = updatedLines.reduce(
          (sum, item) => sum + Number(item.cost.totalAmount.amount),
          0,
        );

        return {
          ...currentCart,
          lines: updatedLines,
          totalQuantity,
          cost: {
            ...currentCart.cost,
            subtotalAmount: {
              amount: totalAmount.toString(),
              currencyCode: currentCart.cost.subtotalAmount.currencyCode,
            },
            totalAmount: {
              amount: totalAmount.toString(),
              currencyCode: currentCart.cost.totalAmount.currencyCode,
            },
          },
        };
      });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  };

  const updateItemQuantity = async (cartItemId: string, quantity: number) => {
    try {
      if (quantity === 0) {
        await removeCartItem({ cartItemId });
      } else {
        await updateCartItemQuantity({ cartItemId, quantity });
      }

      // Update local cart state
      setCart((currentCart) => {
        if (!currentCart) return currentCart;

        const updatedLines = currentCart.lines
          .map((item) =>
            item.id === cartItemId
              ? quantity === 0
                ? null // Will be filtered out
                : {
                    ...item,
                    quantity,
                    cost: {
                      ...item.cost,
                      totalAmount: {
                        ...item.cost.totalAmount,
                        amount: (
                          (Number(item.cost.totalAmount.amount) /
                            item.quantity) *
                          quantity
                        ).toString(),
                      },
                    },
                  }
              : item,
          )
          .filter(Boolean) as SelectCartItem[];

        // Update totals
        const totalQuantity = updatedLines.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const totalAmount = updatedLines.reduce(
          (sum, item) => sum + Number(item.cost.totalAmount.amount),
          0,
        );

        return {
          ...currentCart,
          lines: updatedLines,
          totalQuantity,
          cost: {
            ...currentCart.cost,
            subtotalAmount: {
              amount: totalAmount.toString(),
              currencyCode: currentCart.cost.subtotalAmount.currencyCode,
            },
            totalAmount: {
              amount: totalAmount.toString(),
              currencyCode: currentCart.cost.totalAmount.currencyCode,
            },
          },
        };
      });
    } catch (error) {
      console.error("Failed to update item quantity:", error);
      throw error;
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      await removeCartItem({ cartItemId });

      // Update local cart state
      setCart((currentCart) => {
        if (!currentCart) return currentCart;

        const updatedLines = currentCart.lines.filter(
          (item) => item.id !== cartItemId,
        );

        // Update totals
        const totalQuantity = updatedLines.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const totalAmount = updatedLines.reduce(
          (sum, item) => sum + Number(item.cost.totalAmount.amount),
          0,
        );

        return {
          ...currentCart,
          lines: updatedLines,
          totalQuantity,
          cost: {
            ...currentCart.cost,
            subtotalAmount: {
              amount: totalAmount.toString(),
              currencyCode: currentCart.cost.subtotalAmount.currencyCode,
            },
            totalAmount: {
              amount: totalAmount.toString(),
              currencyCode: currentCart.cost.totalAmount.currencyCode,
            },
          },
        };
      });
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      throw error;
    }
  };

  const contextValue = useMemo(
    () => ({
      cart,
      isLoading,
      error,
      addItem,
      updateItemQuantity,
      removeItem,
    }),
    [cart, isLoading, error, addItem, updateItemQuantity, removeItem],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

/**
 * Custom hook to access the cart context with type safety
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
