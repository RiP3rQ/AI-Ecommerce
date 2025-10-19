"use client";

import { ReactNode, Suspense } from "react";
import { Gallery } from "./gallery";
import { ProductDescription } from "./description";
import { SelectProductImage } from "@/database/schema";
import useSWR, { SWRResponse } from "swr";
import { ProductData } from "@/app/api/product/[id]/types";
import { swrFetcher } from "@/lib/swr-fetcher";
import { BASE_URL } from "@/lib/utils";

export function ProductDetails({
  productUuid,
}: Readonly<{ productUuid: string }>): ReactNode {
  const { data, isLoading, error } = useSWR<SWRResponse<ProductData>>(
    `${BASE_URL}/api/product/${productUuid}`,
    swrFetcher,
  );

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (!data || !data.data) return <div>No data</div>;

  const productData = data.data;

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4">
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
        <div className="h-full w-full basis-full lg:basis-4/6">
          <Suspense
            fallback={
              <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
            }
          >
            <Gallery
              images={productData.product_images
                .slice(0, 5)
                .map((image: SelectProductImage) => ({
                  src: image.url,
                  altText: image.altText ?? "",
                }))}
            />
          </Suspense>
        </div>

        <div className="basis-full lg:basis-2/6">
          <Suspense fallback={null}>
            <ProductDescription product={productData} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
