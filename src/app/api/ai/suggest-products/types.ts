import type { ProductData } from "../../product/[id]/types";

/**
 * Individual product suggestion with reasoning and full product data.
 */
export interface ProductSuggestion {
  productId: string;
  reason: string;
  productData?: ProductData;
}

/**
 * Response for suggest products API.
 */
export interface SuggestProductsResponse {
  success: boolean;
  data: ProductSuggestion[];
}
