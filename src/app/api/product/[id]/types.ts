import type {
  SelectProductWithoutEmbedding,
  SelectProductVariant,
  SelectProductImage,
  SelectProductOption,
} from "@/database/schema";
import type { PriceRange } from "@/types/products";

/**
 * Single product response data structure.
 */
export interface ProductData extends SelectProductWithoutEmbedding {
  product_variants: SelectProductVariant[];
  product_images: SelectProductImage[];
  product_options: SelectProductOption[];
  priceRange: PriceRange;
}

/**
 * Product API response.
 */
export interface ProductResponse {
  success: boolean;
  data: ProductData;
}
