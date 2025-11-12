import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { FrontendCart, SelectCartItem } from "@/types/cart";
import type {
  SelectProductWithoutEmbedding,
  SelectProductVariant,
} from "@/database/schema";

export interface CartState {
  cart: FrontendCart | undefined;
  isOpen: boolean;
  directionOfTheSheet: "left" | "right";
  isLoading: boolean;
  error: Error | null;
}

const initialState: CartState = {
  cart: undefined,
  isOpen: false,
  directionOfTheSheet: "right",
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<FrontendCart | undefined>) => {
      state.cart = action.payload;
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setDirectionOfTheSheet: (
      state,
      action: PayloadAction<"left" | "right">,
    ) => {
      state.directionOfTheSheet = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<Error | null>) => {
      state.error = action.payload;
    },
    clearCart: (state) => {
      state.cart = undefined;
      state.isOpen = false;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    addItemOptimistically: (
      state,
      action: PayloadAction<{
        variant: SelectProductVariant;
        product: SelectProductWithoutEmbedding;
        featuredImage?: {
          url: string;
          altText?: string;
          width?: number;
          height?: number;
        };
      }>,
    ) => {
      if (!state.cart) return;

      const { variant, product, featuredImage } = action.payload;
      const existingItem = state.cart.lines.find(
        (item) => item.merchandise.id === variant.id,
      );

      let updatedLines: SelectCartItem[];

      if (existingItem) {
        // Update existing item quantity
        updatedLines = state.cart.lines.map((item) =>
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
        updatedLines = [...state.cart.lines, newItem];
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

      state.cart = {
        ...state.cart,
        lines: updatedLines,
        totalQuantity,
        cost: {
          ...state.cart.cost,
          subtotalAmount: {
            amount: totalAmount.toString(),
            currencyCode: state.cart.cost.subtotalAmount.currencyCode,
          },
          totalAmount: {
            amount: totalAmount.toString(),
            currencyCode: state.cart.cost.totalAmount.currencyCode,
          },
        },
      };
    },
    updateItemQuantityOptimistically: (
      state,
      action: PayloadAction<{ cartItemId: string; quantity: number }>,
    ) => {
      if (!state.cart) return;

      const { cartItemId, quantity } = action.payload;

      const updatedLines = state.cart.lines
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
                        (Number(item.cost.totalAmount.amount) / item.quantity) *
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

      state.cart = {
        ...state.cart,
        lines: updatedLines,
        totalQuantity,
        cost: {
          ...state.cart.cost,
          subtotalAmount: {
            amount: totalAmount.toString(),
            currencyCode: state.cart.cost.subtotalAmount.currencyCode,
          },
          totalAmount: {
            amount: totalAmount.toString(),
            currencyCode: state.cart.cost.totalAmount.currencyCode,
          },
        },
      };
    },
    removeItemOptimistically: (state, action: PayloadAction<string>) => {
      if (!state.cart) return;

      const cartItemId = action.payload;

      const updatedLines = state.cart.lines.filter(
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

      state.cart = {
        ...state.cart,
        lines: updatedLines,
        totalQuantity,
        cost: {
          ...state.cart.cost,
          subtotalAmount: {
            amount: totalAmount.toString(),
            currencyCode: state.cart.cost.subtotalAmount.currencyCode,
          },
          totalAmount: {
            amount: totalAmount.toString(),
            currencyCode: state.cart.cost.totalAmount.currencyCode,
          },
        },
      };
    },
  },
});

export const {
  setCart,
  setIsOpen,
  setDirectionOfTheSheet,
  setLoading,
  setError,
  clearCart,
  openCart,
  closeCart,
  addItemOptimistically,
  updateItemQuantityOptimistically,
  removeItemOptimistically,
} = cartSlice.actions;

export default cartSlice.reducer;
