import type { ReactNode } from "react";
import { ProductCard } from "./product-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { PackageSearchIcon } from "lucide-react";
import type { ProductWithDetails } from "@/app/api/shop/types";
import { Skeleton } from "../ui/skeleton";

interface Product {
  id: string;
  title: string;
  description?: string | null;
  availableForSale: boolean;
  imageUrl?: string;
  price?: number;
  currencyCode?: string;
}

interface ProductsListProps {
  products: ProductWithDetails[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function ProductsList({
  products = [],
  currentPage,
  totalPages,
  totalProducts,
  onPageChange,
  isLoading,
}: ProductsListProps): ReactNode {
  if (isLoading) {
    return (
      <>
        <div className="mb-6" data-testid="loading-skeleton">
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
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Empty>
          <EmptyHeader>
            <PackageSearchIcon className="size-10 text-neutral-400 dark:text-neutral-600 mb-4" />
            <EmptyTitle>No products found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your filters or search criteria
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const generatePageNumbers = (): Array<number | "ellipsis"> => {
    const pages: Array<number | "ellipsis"> = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex flex-col">
      {/* Products Count */}
      <div className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
        Showing <span className="font-semibold">{products.length}</span> of{" "}
        <span className="font-semibold">{totalProducts}</span> products
      </div>

      {/* Products Grid */}
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8"
        data-testid="products-grid"
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 4}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-auto" data-testid="pagination">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {pageNumbers.map((pageNum, index) => (
              <PaginationItem key={`${pageNum}-${index}`}>
                {pageNum === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => onPageChange(pageNum)}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
