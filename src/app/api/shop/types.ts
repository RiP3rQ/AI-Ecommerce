import type { SelectProductWithoutEmbedding } from "@/database/schemas/products";
import type { SelectProductVariant } from "@/database/schemas/product-variants";
import type { SelectProductImage } from "@/database/schemas/product-images";
import type { SelectCategory } from "@/database/schemas/categories";

/**
 * Product with its minimum price variant and featured image.
 */
export interface ProductWithDetails extends SelectProductWithoutEmbedding {
  category: SelectCategory | null;
  featuredImage: SelectProductImage | null;
  minPrice: number;
  maxPrice: number;
  currencyCode: string;
  variantCount: number;
}

/**
 * Pagination metadata for product list responses.
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Shop products list response.
 */
export interface ShopProductsData {
  products: ProductWithDetails[];
  pagination: PaginationMeta;
}

/**
 * Response for shop products endpoint.
 */
export interface ShopProductsResponse {
  success: boolean;
  data: ShopProductsData;
}
