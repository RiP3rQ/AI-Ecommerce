import type {
  SelectProduct,
  SelectProductImage,
  SelectProductVariant,
} from "@/database/schema";

/**
 * Product data without the embedding column for main page display.
 */
export type ProductWithoutEmbedding = Omit<SelectProduct, "embedding">;

/**
 * Represents a product with its main image and variant data for the main page.
 */
export interface LatestProductsItem {
  products: ProductWithoutEmbedding;
  product_images: SelectProductImage | null;
  product_variants: SelectProductVariant | null;
}

/**
 * Main page data response containing latest products.
 */
export interface MainPageResponse {
  success: boolean;
  data: LatestProductsItem[];
}
