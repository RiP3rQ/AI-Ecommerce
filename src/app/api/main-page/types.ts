import type {
  SelectProduct,
  SelectProductImage,
  SelectProductVariant,
} from "@/database/schema";

/**
 * Represents a product with its main image and variant data for the main page.
 */
export interface LatestProductsItem {
  products: SelectProduct;
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
