"use client";

import { swrFetcher } from "@/lib/swr-fetcher";
import { buildShopUrl } from "@/lib/shop-api";
import {
  paginationUrlSchema,
  shopFiltersUrlSchema,
  DEFAULT_SHOP_FILTERS,
  DEFAULT_PAGINATION,
  PaginationUrlSchema,
  ShopFiltersUrlSchema,
} from "@/schemas/shop-url-schema";
import { parseAsJson, useQueryState } from "nuqs";
import { ReactNode, useCallback, useMemo } from "react";
import useSWR from "swr";
import { Filters } from "./filter";
import { SearchbarAndSorts } from "./searchbar-and-sorts";
import { ProductsList } from "./products-list";
import { Skeleton } from "@/components/ui/skeleton";
import { SWRResponse } from "@/types/swr";
import { ShopProductsData } from "@/app/api/shop/types";
import { CLIENT_SIDE_URL_UPDATE_OPTIONS } from "@/lib/nuqs";
import { error } from "console";

export function ShopWrapper({
  categoryName,
}: Readonly<{ categoryName: string }>): ReactNode {
  // ============================= URL STATES =============================
  const [pagination, setPagination] = useQueryState(
    "pagination",
    parseAsJson(paginationUrlSchema)
      .withDefault(DEFAULT_PAGINATION)
      .withOptions(CLIENT_SIDE_URL_UPDATE_OPTIONS)
  );
  const [filters, setFilters] = useQueryState(
    "filters",
    parseAsJson(shopFiltersUrlSchema)
      .withDefault(DEFAULT_SHOP_FILTERS)
      .withOptions(CLIENT_SIDE_URL_UPDATE_OPTIONS)
  );

  // ============================= DATA FETCHING =============================
  const { data, isLoading, error } = useSWR<SWRResponse<ShopProductsData>>(
    buildShopUrl({
      pagination: pagination as PaginationUrlSchema,
      filters: filters as ShopFiltersUrlSchema,
    }),
    swrFetcher
  );

  // ============================= MEMOIZED DATA =============================
  const products = useMemo(() => data?.data.products || [], [data]);
  const paginationMetadata = useMemo(() => data?.data.pagination, [data]);

  const paginationUrlData = useMemo(
    () => pagination as PaginationUrlSchema,
    [pagination]
  );
  const filtersUrlData = useMemo(() => {
    return {
      ...filters,
      categoryId: filters.categoryId !== "all" ? filters.categoryId : "",
    } as ShopFiltersUrlSchema;
  }, [filters]);

  // ============================= HANDLERS =============================
  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      setFilters({
        ...(filtersUrlData as ShopFiltersUrlSchema),
        categoryId: categoryId,
      });
      setPagination({ ...(paginationUrlData as PaginationUrlSchema), page: 1 });
    },
    [filtersUrlData, paginationUrlData, setFilters, setPagination]
  );

  const handlePriceRangeChange = useCallback(
    (priceRange: { min: number; max: number }) => {
      setFilters({
        ...(filtersUrlData as ShopFiltersUrlSchema),
        priceRange,
      });
      setPagination({ ...(paginationUrlData as PaginationUrlSchema), page: 1 });
    },
    [filtersUrlData, paginationUrlData, setFilters, setPagination]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_SHOP_FILTERS);
    setPagination(DEFAULT_PAGINATION);
  }, [setFilters, setPagination]);

  const handleSearchChange = useCallback(
    (search: string) => {
      setFilters({
        ...(filtersUrlData as ShopFiltersUrlSchema),
        search,
      });
      setPagination({ ...(paginationUrlData as PaginationUrlSchema), page: 1 });
    },
    [filtersUrlData, paginationUrlData, setFilters, setPagination]
  );

  const handleSortChange = useCallback(
    (sortField: string, sortDirection: "asc" | "desc") => {
      setFilters({
        ...(filtersUrlData as ShopFiltersUrlSchema),
        sortField,
        sortDirection,
      });
    },
    [filtersUrlData, setFilters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination({ ...(paginationUrlData as PaginationUrlSchema), page });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [paginationUrlData, setPagination]
  );

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Filters Sidebar - 30% width on desktop */}
      <div className="hidden lg:block lg:w-[30%] xl:w-[25%]">
        {isLoading ? (
          <div className="sticky top-0 h-screen border-r border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-px w-full mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : (
          <Filters
            selectedCategory={filtersUrlData.categoryId}
            priceRange={filtersUrlData.priceRange}
            onCategoryChange={handleCategoryChange}
            onPriceRangeChange={handlePriceRangeChange}
            onResetFilters={handleResetFilters}
          />
        )}
      </div>

      {/* Main Content - 70% width on desktop */}
      <div className="flex-1 lg:w-[70%] xl:w-[75%]">
        <div className="mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
          {isLoading ? (
            <>
              <div className="mb-6">
                <Skeleton className="h-10 w-full max-w-md mb-4" />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <SearchbarAndSorts
                searchValue={filtersUrlData.search}
                sortField={filtersUrlData.sortField}
                sortDirection={filtersUrlData.sortDirection}
                onSearchChange={handleSearchChange}
                onSortChange={handleSortChange}
              />
              <ProductsList
                products={products}
                currentPage={paginationUrlData.page}
                totalPages={paginationMetadata?.totalPages || 1}
                totalProducts={paginationMetadata?.totalItems || 0}
                onPageChange={handlePageChange}
                categoryName={categoryName}
                filters={filtersUrlData}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
