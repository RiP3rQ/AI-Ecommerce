"use client";

import { CartResponse } from "@/app/api/cart/types";
import { SelectProduct, SelectProductVariant } from "@/database/schema";
import { swrFetcher } from "@/lib/swr-fetcher";
import {
  CartCost,
  CartItemCost,
  CartMerchandise,
  SelectCartItem,
  FrontendCart,
} from "@/types/cart";
import React, {
  createContext,
  useContext,
  useMemo,
  useOptimistic,
  startTransition,
} from "react";
import useSWR, { mutate } from "swr";

type UpdateType = "plus" | "minus" | "delete";

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { merchandiseId: string; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: {
        variant: SelectProductVariant;
        product: SelectProduct;
        featuredImage?: {
          url: string;
          altText?: string;
          width?: number;
          height?: number;
        };
      };
    };

type CartContextType = {
  cartUrl: string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Transforms CartResponse from API to FrontendCart structure
 */
function transformCartResponse(response: CartResponse): FrontendCart {
  const { cart, totalItems, totalPrice, currencyCode } = response.data;

  const lines: SelectCartItem[] = cart.items.map((item) => {
    const itemTotal = (item.productVariant.price / 100) * item.quantity;

    return {
      id: item.id,
      quantity: item.quantity,
      cost: {
        totalAmount: {
          amount: itemTotal.toString(),
          currencyCode: item.productVariant.currencyCode,
        },
      },
      merchandise: {
        id: item.productVariant.id,
        title: item.productVariant.title,
        selectedOptions: item.productVariant.selectedOptions as Array<{
          name: string;
          value: string;
        }>,
        product: {
          id: item.productVariant.product.id,
          handle: item.productVariant.product.id,
          title: item.productVariant.product.title,
          featuredImage: item.featuredImage
            ? {
                url: item.featuredImage.url,
                altText: item.featuredImage.altText || undefined,
                width: item.featuredImage.width || undefined,
                height: item.featuredImage.height || undefined,
              }
            : null,
        },
      },
    };
  });

  const totalAmount = (totalPrice / 100).toString();

  return {
    id: cart.id,
    checkoutUrl: "",
    totalQuantity: totalItems,
    lines,
    cost: {
      subtotalAmount: { amount: totalAmount, currencyCode },
      totalAmount: { amount: totalAmount, currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function calculateItemCost(quantity: number, priceInCents: number): string {
  // Convert from cents to dollars for display
  const priceInDollars = priceInCents / 100;
  return (priceInDollars * quantity).toString();
}

function updateCartItem(
  item: SelectCartItem,
  updateType: UpdateType
): SelectCartItem | null {
  if (updateType === "delete") return null;

  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(newQuantity, singleItemAmount * 100);

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

function createOrUpdateCartItem(
  existingItem: SelectCartItem | undefined,
  variant: SelectProductVariant,
  product: SelectProduct,
  featuredImage?: {
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  }
): SelectCartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.currencyCode,
      },
    } as CartItemCost,
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
    } as CartMerchandise,
  };
}

function updateCartTotals(
  lines: SelectCartItem[]
): Pick<FrontendCart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function createEmptyCart(): FrontendCart {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
      totalTaxAmount: { amount: "0", currencyCode: "USD" },
    } as CartCost,
  };
}

function cartReducer(
  state: FrontendCart | undefined,
  action: CartAction
): FrontendCart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) =>
          item.merchandise.id === merchandiseId
            ? updateCartItem(item, updateType)
            : item
        )
        .filter(Boolean) as SelectCartItem[];

      if (updatedLines.length === 0) {
        return {
          ...currentCart,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentCart.cost,
            totalAmount: { ...currentCart.cost.totalAmount, amount: "0" },
          },
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "ADD_ITEM": {
      const { variant, product, featuredImage } = action.payload;
      const existingItem = currentCart.lines.find(
        (item) => item.merchandise.id === variant.id
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product,
        featuredImage
      );

      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item
          )
        : [...currentCart.lines, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    default:
      return currentCart;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Provide the cart API endpoint URL for SWR
  const cartUrl = "/api/cart";

  return (
    <CartContext.Provider value={{ cartUrl }}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  // Use SWR to fetch cart data asynchronously
  const {
    data: cartResponse,
    error,
    isLoading,
  } = useSWR<CartResponse>(context.cartUrl, swrFetcher);

  // Transform the API response to frontend format
  const initialCart = cartResponse
    ? transformCartResponse(cartResponse)
    : undefined;

  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer
  );

  const updateCartItem = (merchandiseId: string, updateType: UpdateType) => {
    startTransition(() => {
      updateOptimisticCart({
        type: "UPDATE_ITEM",
        payload: { merchandiseId, updateType },
      });
    });
  };

  const addCartItem = (
    variant: SelectProductVariant,
    product: SelectProduct,
    featuredImage?: {
      url: string;
      altText?: string;
      width?: number;
      height?: number;
    }
  ) => {
    startTransition(() => {
      updateOptimisticCart({
        type: "ADD_ITEM",
        payload: { variant, product, featuredImage },
      });
    });
  };

  const refreshCart = () => {
    mutate(context.cartUrl);
  };

  return useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
      refreshCart,
      isLoading,
      error,
    }),
    [optimisticCart, isLoading, error, context.cartUrl]
  );
}
