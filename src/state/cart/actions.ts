"use client";

import { useRecoilCallback } from "recoil";
import type {
  SelectProductWithoutEmbedding,
  SelectProductVariant,
} from "@/database/schema";
import type { FrontendCart, SelectCartItem } from "@/types/cart";
import {
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
} from "@/lib/cart-api";
import { transformCartResponse } from "@/lib/cart-helpers";
import { useAuth } from "@/hooks/use-auth";
import { cartState } from "./atoms";

/**
 * Custom hook for cart actions using Recoil callbacks
 */
export function useCartActions() {
  const { isAuthenticated } = useAuth();

  /**
   * Add item to cart
   */
  const addItem = useRecoilCallback(
    ({ set, snapshot }) =>
      async (
        variant: SelectProductVariant,
        product: SelectProductWithoutEmbedding,
        featuredImage?: {
          url: string;
          altText?: string;
          width?: number;
          height?: number;
        },
      ): Promise<void> => {
        // Check authentication before allowing cart operations
        if (!isAuthenticated) {
          return;
        }

        try {
          // Get current cart state
          const currentCart = await snapshot.getPromise(cartState);

          // Fire-and-forget add item to cart
          addItemToCart({
            productVariantId: variant.id,
            quantity: 1,
          }).then((data) => {
            const updatedCart = transformCartResponse(data);
            set(cartState, updatedCart);
          });

          // Optimistically update local cart state
          set(cartState, (currentCart) => {
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
                            (Number(item.cost.totalAmount.amount) /
                              item.quantity) *
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
      },
    [isAuthenticated],
  );

  /**
   * Update item quantity in cart
   */
  const updateItemQuantity = useRecoilCallback(
    ({ set, snapshot }) =>
      async (cartItemId: string, quantity: number): Promise<void> => {
        // Check authentication before allowing cart operations
        if (!isAuthenticated) {
          return;
        }

        try {
          // Get current cart state
          const currentCart = await snapshot.getPromise(cartState);

          // Fire-and-forget update item quantity or remove item if quantity is 0
          if (quantity === 0) {
            removeCartItem({ cartItemId });
          } else {
            updateCartItemQuantity({ cartItemId, quantity });
          }

          // Optimistically update local cart state
          set(cartState, (currentCart) => {
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
      },
    [isAuthenticated],
  );

  /**
   * Remove item from cart
   */
  const removeItem = useRecoilCallback(
    ({ set, snapshot }) =>
      async (cartItemId: string): Promise<void> => {
        // Check authentication before allowing cart operations
        if (!isAuthenticated) {
          return;
        }

        try {
          // Get current cart state
          const currentCart = await snapshot.getPromise(cartState);

          // Fire-and-forget remove item from cart
          removeCartItem({ cartItemId });

          // Optimistically update local cart state
          set(cartState, (currentCart) => {
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
      },
    [isAuthenticated],
  );

  /**
   * Clear cart
   */
  const clearCart = useRecoilCallback(
    ({ set }) =>
      async (): Promise<void> => {
        // Check authentication before allowing cart operations
        if (!isAuthenticated) {
          return;
        }

        // Just cleanup frontend state
        set(cartState, undefined);
      },
    [isAuthenticated],
  );

  return {
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
  };
}
