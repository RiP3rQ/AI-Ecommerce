"use client";

import type { CartResponse } from "@/app/api/cart/types";
import type {
  SelectProductWithoutEmbedding,
  SelectProductVariant,
} from "@/database/schema";
import { swrFetcher } from "@/lib/swr-fetcher";
import { BASE_URL } from "@/lib/utils";
import type { FrontendCart, SelectCartItem } from "@/types/cart";
import {
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
} from "@/lib/cart-api";
import { createClientSupabaseClient } from "@/supabase-auth/client";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSWR from "swr";
import { transformCartResponse } from "@/lib/cart-helpers";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

type CartContextType = {
  clearCart: () => Promise<void>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  cart: FrontendCart | undefined;
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

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [directionOfTheSheet, setDirectionOfTheSheet] = useState<
    "left" | "right"
  >("right");
  const cartUrl = `${BASE_URL}/api/cart`;
  const { isAuthenticated } = useAuth();

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

  // Local cart state that gets updated when we make changes
  const [cart, setCart] = useState<FrontendCart | undefined>(
    cartResponse ? transformCartResponse(cartResponse) : undefined,
  );

  // Update local state when SWR data changes
  useEffect(() => {
    if (cartResponse) {
      setCart(transformCartResponse(cartResponse));
      // If cart already exists, open the cart
      if (cart) {
        setIsOpen(true);
      }
    }
  }, [cartResponse]);

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
      // Fire-and-forget add item to cart
      addItemToCart({
        productVariantId: variant.id,
        quantity: 1,
      }).then((data) => {
        setCart(transformCartResponse(data));
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
    // Check authentication before allowing cart operations
    if (!isAuthenticated) {
      return;
    }

    try {
      // Fire-and-forget update item quantity or remove item if quantity is 0
      if (quantity === 0) {
        removeCartItem({ cartItemId });
      } else {
        updateCartItemQuantity({ cartItemId, quantity });
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
    // Check authentication before allowing cart operations
    if (!isAuthenticated) {
      return;
    }

    try {
      // Fire-and-forget remove item from cart
      removeCartItem({ cartItemId });

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

  const clearCart = async () => {
    // Check authentication before allowing cart operations
    if (!isAuthenticated) {
      return;
    }

    // Just cleanup frontend state
    setCart(undefined);
    setIsOpen(false);
  };

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      clearCart,
      isOpen,
      setIsOpen,
      cart,
      isLoading,
      error,
      mutate,
      addItem,
      updateItemQuantity,
      removeItem,
      openCart,
      closeCart,
      directionOfTheSheet,
      setDirectionOfTheSheet,
    }),
    [
      clearCart,
      isOpen,
      setIsOpen,
      cart,
      isLoading,
      error,
      mutate,
      addItem,
      updateItemQuantity,
      removeItem,
      openCart,
      closeCart,
      directionOfTheSheet,
      setDirectionOfTheSheet,
    ],
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
