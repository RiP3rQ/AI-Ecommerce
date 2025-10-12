import {
  PaginationUrlSchema,
  ShopFiltersUrlSchema,
} from "@/schemas/shop-url-schema";

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
    category: filters.category,
    priceMin: filters.priceRange?.min?.toString(),
    priceMax: filters.priceRange?.max?.toString(),
  };

  return `${process.env.NEXT_PUBLIC_API_URL}/api/products?${new URLSearchParams(
    params
  ).toString()}`;
}
