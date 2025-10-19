"use client";

import { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { GridTileImage } from "../grid/single-tile";
import { LatestProductsItem } from "@/app/api/main-page/types";
import { swrFetcher } from "@/lib/swr-fetcher";
import { BASE_URL } from "@/lib/utils";
import useSWR, { SWRResponse } from "swr";

export function ItemsMarquee(): ReactNode {
  // ============================= SWR DATA =============================
  const { data, isLoading } = useSWR<SWRResponse<LatestProductsItem[]>>(
    `${BASE_URL}/api/main-page?limit=20&skipFirstNumberOfProducts=3`,
    swrFetcher,
  );

  if (!data?.data?.length) return null;

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  const carouselProducts = [...data.data];

  if (!carouselProducts?.length)
    return (
      <div className="w-full overflow-x-auto pb-6 pt-1">
        <ul className="flex animate-carousel gap-4">
          {new Array(20).fill(null).map((_, i) => (
            <li
              key={`${i}`}
              className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
            >
              <Skeleton className="h-full w-full" />
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <div className="w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {carouselProducts?.map((product, i) => (
          <li
            key={`${product.products.id}-${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <Link
              href={`/product/${product.products.id}`}
              className="relative h-full w-full"
            >
              <GridTileImage
                alt={product.product_images?.altText ?? product.products.title}
                label={{
                  title: product.products.title,
                  amount: product.product_variants?.price,
                  currencyCode: product.product_variants?.currencyCode,
                }}
                src={product.product_images?.url ?? ""}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
