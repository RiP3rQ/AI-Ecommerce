import type { ReactNode } from "react";
import { Link } from "react-transition-progress/next";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Price } from "../custom-price";
import type { ProductWithDetails } from "@/app/api/shop/types";

interface ProductCardProps {
  product: ProductWithDetails;
  priority?: boolean;
}

export function ProductCard({
  product,
  priority = false,
}: ProductCardProps): ReactNode {
  const hasImage = !!product.featuredImage?.url;

  return (
    <Link
      href={`/product/${product.id}`}
      prefetch={true}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:border-blue-600 hover:shadow-lg dark:border-neutral-800 dark:bg-black dark:hover:border-blue-500"
      data-testid="product-card"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        {hasImage ? (
          <Image
            src={product.featuredImage?.url || ""}
            alt={product.featuredImage?.altText || ""}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            priority={priority}
            className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-4xl text-neutral-400 dark:text-neutral-600">
              📦
            </span>
          </div>
        )}

        {/* Availability Badge */}
        {!product.availableForSale && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge variant="destructive" className="text-sm font-semibold">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="mb-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {product.title}
          </h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400">
              {product.description}
            </p>
          )}
        </div>

        {/* Price */}
        {product.minPrice !== undefined &&
          product.maxPrice !== undefined &&
          product.currencyCode && (
            <div className="mt-auto" data-testid="product-price">
              <Price
                amount={product.minPrice.toString()}
                currencyCode={product.currencyCode}
                className={cn(
                  "text-base font-bold",
                  !product.availableForSale &&
                    "text-neutral-400 dark:text-neutral-600",
                )}
              />
            </div>
          )}
      </div>
    </Link>
  );
}
