import type {
  SelectCart as DbSelectCart,
  SelectCartItem as DbSelectCartItem,
  SelectProductWithoutEmbedding,
  SelectProductVariant,
} from "@/database/schema";

export interface CartCost {
  subtotalAmount: {
    amount: string;
    currencyCode: string;
  };
  totalAmount: {
    amount: string;
    currencyCode: string;
  };
  totalTaxAmount: {
    amount: string;
    currencyCode: string;
  };
}

export interface CartItemCost {
  totalAmount: {
    amount: string;
    currencyCode: string;
  };
}

export interface CartMerchandise {
  id: string;
  title: string;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  product: {
    id: string;
    handle: string;
    title: string;
    featuredImage: {
      url: string;
      altText?: string;
      width?: number;
      height?: number;
    } | null;
  };
}

export interface SelectCartItem {
  id: string | undefined;
  quantity: number;
  cost: CartItemCost;
  merchandise: CartMerchandise;
}

export interface SelectCart {
  id: string | undefined;
  checkoutUrl: string;
  totalQuantity: number;
  lines: SelectCartItem[];
  cost: CartCost;
}

/**
 * Frontend cart structure for the cart provider.
 * This matches the structure expected by the UI components.
 */
export interface FrontendCart {
  id: string | undefined;
  checkoutUrl: string;
  totalQuantity: number;
  lines: SelectCartItem[];
  cost: CartCost;
}

// Utility types for database operations
export type DbCartWithItems = DbSelectCart & {
  items: (DbSelectCartItem & {
    productVariant: SelectProductVariant & {
      product: SelectProductWithoutEmbedding & {
        images: Array<{
          url: string;
          altText?: string;
          width?: number;
          height?: number;
        }>;
      };
    };
  })[];
};
