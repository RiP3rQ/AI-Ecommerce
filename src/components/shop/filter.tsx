"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, XIcon, FilterIcon } from "lucide-react";
import { BASE_URL, cn } from "@/lib/utils";
import { SelectCategory } from "@/database/schema";
import { swrFetcher } from "@/lib/swr-fetcher";
import useSWR, { SWRResponse } from "swr";

interface FiltersProps {
  selectedCategory?: string;
  priceRange: { min: number; max: number };
  onCategoryChange: (categoryId: string) => void;
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onResetFilters: () => void;
  searchParamCategoryName?: string;
}

export function Filters({
  selectedCategory,
  priceRange,
  onCategoryChange,
  onPriceRangeChange,
  onResetFilters,
  searchParamCategoryName,
}: FiltersProps): ReactNode {
  const [localMinPrice, setLocalMinPrice] = useState(
    (priceRange.min / 100).toString(),
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    (priceRange.max / 100).toString(),
  );

  // ============================= SWR DATA =============================
  const { data, isLoading, error } = useSWR<SWRResponse<SelectCategory[]>>(
    `${BASE_URL}/api/categories`,
    swrFetcher,
  );

  useEffect(() => {
    if (searchParamCategoryName && data?.data) {
      const categoryId = data.data.find(
        (category) =>
          category.name.toLowerCase() === searchParamCategoryName.toLowerCase(),
      )?.id;
      if (categoryId) {
        console.log("categoryId", categoryId);
        console.log("searchParamCategoryName", searchParamCategoryName);
        onCategoryChange(categoryId);
      }
    }
  }, [searchParamCategoryName, data]);

  const handleApplyPriceRange = (): void => {
    // Convert dollars to cents for API (database stores prices in cents)
    const min = Math.floor((Number.parseFloat(localMinPrice) || 0) * 100);
    const max = Math.floor((Number.parseFloat(localMaxPrice) || 1000000) * 100);
    onPriceRangeChange({ min, max });
  };

  const hasActiveFilters =
    selectedCategory || priceRange.min > 0 || priceRange.max < 100000; // 1000 dollars * 100 cents

  const categories = useMemo(() => data?.data || [], [data]);

  return (
    <aside className="sticky top-0 h-screen w-full overflow-y-auto border-r border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FilterIcon className="size-5 text-neutral-700 dark:text-neutral-300" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Filters
          </h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="h-8 px-2 text-xs"
          >
            <XIcon className="size-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <Separator className="mb-6" />

      {/* Categories Filter */}
      <div className="mb-8">
        <Label className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Categories
        </Label>
        <div className="space-y-2 mt-3">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-all",
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-900",
                )}
              >
                <span className="font-medium">{category.name}</span>
                {isSelected && (
                  <CheckIcon className="size-4 text-blue-600 dark:text-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Price Range Filter */}
      <div className="mb-6">
        <Label className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Price Range
        </Label>
        <div className="space-y-4 mt-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Label
                htmlFor="min-price"
                className="mb-2 text-xs text-neutral-600 dark:text-neutral-400"
              >
                Min Price
              </Label>
              <Input
                id="min-price"
                type="number"
                placeholder="0"
                value={localMinPrice}
                onChange={(event) => setLocalMinPrice(event.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex-1">
              <Label
                htmlFor="max-price"
                className="mb-2 text-xs text-neutral-600 dark:text-neutral-400"
              >
                Max Price
              </Label>
              <Input
                id="max-price"
                type="number"
                placeholder="1000000"
                value={localMaxPrice}
                onChange={(event) => setLocalMaxPrice(event.target.value)}
                className="h-9"
              />
            </div>
          </div>
          <Button onClick={handleApplyPriceRange} className="w-full" size="sm">
            Apply Price Range
          </Button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <>
          <Separator className="mb-6" />
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Active Filters
            </Label>
            <div className="flex flex-wrap gap-2">
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  Category:{" "}
                  {categories.find((cat) => cat.id === selectedCategory)?.name}
                  <button
                    type="button"
                    onClick={() => onCategoryChange("")}
                    className="ml-1 hover:text-destructive"
                    aria-label="Remove category filter"
                  >
                    <XIcon className="size-3" />
                  </button>
                </Badge>
              )}
              {(priceRange.min > 0 || priceRange.max < 1000000) && (
                <Badge variant="secondary" className="gap-1">
                  ${(priceRange.min / 100).toFixed(0)} - $
                  {(priceRange.max / 100).toFixed(0)}
                  <button
                    type="button"
                    onClick={() => onPriceRangeChange({ min: 0, max: 1000000 })}
                    className="ml-1 hover:text-destructive"
                    aria-label="Remove price filter"
                  >
                    <XIcon className="size-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
