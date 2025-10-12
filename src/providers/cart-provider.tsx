"use client";

import { SelectProduct, SelectProductVariant } from "@/database/schema";
import {
  SelectCart,
  SelectCartItem,
  CartCost,
  CartItemCost,
  CartMerchandise,
} from "@/types/cart";
import React, {
  createContext,
  use,
  useContext,
  useMemo,
  useOptimistic,
} from "react";

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
  cartPromise: Promise<SelectCart | undefined>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

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
  const newTotalAmount = calculateItemCost(newQuantity, singleItemAmount);

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
        handle: product.id, // Use product id as handle for now
        title: product.title,
        featuredImage: featuredImage || null,
      },
    } as CartMerchandise,
  };
}

function updateCartTotals(
  lines: SelectCartItem[]
): Pick<SelectCart, "totalQuantity" | "cost"> {
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

function createEmptyCart(): SelectCart {
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
  state: SelectCart | undefined,
  action: CartAction
): SelectCart {
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

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<SelectCart | undefined>;
}) {
  return (
    <CartContext.Provider value={{ cartPromise }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  const initialCart = use(context.cartPromise);
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer
  );

  const updateCartItem = (merchandiseId: string, updateType: UpdateType) => {
    updateOptimisticCart({
      type: "UPDATE_ITEM",
      payload: { merchandiseId, updateType },
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
    updateOptimisticCart({
      type: "ADD_ITEM",
      payload: { variant, product, featuredImage },
    });
  };

  return useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
    }),
    [optimisticCart]
  );
}
