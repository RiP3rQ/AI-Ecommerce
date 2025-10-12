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
import { ReactNode, useCallback } from "react";
import useSWR from "swr";
import { Filters } from "./filter";
import { SearchbarAndSorts } from "./searchbar-and-sorts";
import { ProductsList } from "./products-list";
import { Skeleton } from "@/components/ui/skeleton";

export function ShopWrapper({
  categoryName,
}: Readonly<{ categoryName: string }>): ReactNode {
  // ============================= URL STATES =============================
  const [pagination, setPagination] = useQueryState(
    "pagination",
    parseAsJson(paginationUrlSchema).withDefault(DEFAULT_PAGINATION)
  );
  const [filters, setFilters] = useQueryState(
    "filters",
    parseAsJson(shopFiltersUrlSchema).withDefault({
      ...DEFAULT_SHOP_FILTERS,
      category: categoryName,
    })
  );

  // ============================= DATA FETCHING =============================
  const { data, isLoading, error } = useSWR(
    buildShopUrl({
      pagination: pagination as PaginationUrlSchema,
      filters: filters as ShopFiltersUrlSchema,
    }),
    swrFetcher
  );

  // ============================= HANDLERS =============================
  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      setFilters({
        ...(filters as ShopFiltersUrlSchema),
        category: categoryId,
      });
      setPagination({ ...(pagination as PaginationUrlSchema), page: 1 });
    },
    [filters, pagination, setFilters, setPagination]
  );

  const handlePriceRangeChange = useCallback(
    (priceRange: { min: number; max: number }) => {
      setFilters({
        ...(filters as ShopFiltersUrlSchema),
        priceRange,
      });
      setPagination({ ...(pagination as PaginationUrlSchema), page: 1 });
    },
    [filters, pagination, setFilters, setPagination]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      ...DEFAULT_SHOP_FILTERS,
      category: categoryName,
    });
    setPagination(DEFAULT_PAGINATION);
  }, [categoryName, setFilters, setPagination]);

  const handleSearchChange = useCallback(
    (search: string) => {
      setFilters({
        ...(filters as ShopFiltersUrlSchema),
        search,
      });
      setPagination({ ...(pagination as PaginationUrlSchema), page: 1 });
    },
    [filters, pagination, setFilters, setPagination]
  );

  const handleSortChange = useCallback(
    (sortField: string, sortDirection: "asc" | "desc") => {
      setFilters({
        ...(filters as ShopFiltersUrlSchema),
        sortField,
        sortDirection,
      });
    },
    [filters, setFilters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination({ ...(pagination as PaginationUrlSchema), page });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [pagination, setPagination]
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
            categories={data?.categories || []}
            selectedCategory={(filters as ShopFiltersUrlSchema).category}
            priceRange={(filters as ShopFiltersUrlSchema).priceRange}
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
                searchValue={(filters as ShopFiltersUrlSchema).search}
                sortField={(filters as ShopFiltersUrlSchema).sortField}
                sortDirection={(filters as ShopFiltersUrlSchema).sortDirection}
                onSearchChange={handleSearchChange}
                onSortChange={handleSortChange}
              />
              <ProductsList
                products={data?.products || []}
                currentPage={(pagination as PaginationUrlSchema).page}
                totalPages={data?.totalPages || 1}
                totalProducts={data?.totalProducts || 0}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
