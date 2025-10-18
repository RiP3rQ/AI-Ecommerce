import {
  PaginationUrlSchema,
  ShopFiltersUrlSchema,
} from "@/schemas/shop-url-schema";
import { BASE_URL } from "./utils";

export function buildShopUrl({
  pagination,
  filters,
}: Readonly<{
  pagination: PaginationUrlSchema;
  filters: ShopFiltersUrlSchema;
}>): string {
  const params: Record<string, string> = {
    page: pagination.page.toString(),
    limit: pagination.limit.toString(),
    sortDirection: filters.sortDirection,
    sortField: filters.sortField,
    search: filters.search,
    categoryId: filters.categoryId,
    categoryName: filters.categoryName,
    priceMin: filters.priceRange?.min?.toString(),
    priceMax: filters.priceRange?.max?.toString(),
  };

  return `${BASE_URL}/api/shop?${new URLSearchParams(params).toString()}`;
}
