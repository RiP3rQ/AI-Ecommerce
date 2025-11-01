"use client";

import { type ReactNode, Suspense } from "react";
import { Gallery } from "./gallery";
import { ProductDescription } from "./description";
import { AddReviewBox } from "./add-review-box";
import { ReviewsList } from "./reviews-list";
import type { SelectProductImage } from "@/database/schema";
import useSWR, { type SWRResponse } from "swr";
import type { ProductData } from "@/app/api/product/[id]/types";
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

      {/* Reviews Section */}
      <div className="mt-12 mb-12 space-y-8">
        {/* Add Review Box */}
        <Suspense
          fallback={
            <div className="h-64 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />
          }
        >
          <AddReviewBox productUuid={productUuid} />
        </Suspense>

        {/* Reviews List */}
        <Suspense
          fallback={
            <div className="h-96 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />
          }
        >
          <ReviewsList reviews={mockReviews} isLoading={false} />
        </Suspense>
      </div>
    </div>
  );
}

// Mock review data - replace with actual API data later
const mockReviews = [
  {
    id: "1",
    rating: 4.5,
    content:
      "Great product! Exactly what I was looking for. The quality is excellent and it arrived quickly. Highly recommend!",
    createdAt: new Date("2024-11-15"),
    user: {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
    },
  },
  {
    id: "2",
    rating: 5.0,
    content:
      "Absolutely love this! The design is modern and it works perfectly. Customer service was also very helpful when I had questions.",
    createdAt: new Date("2024-11-10"),
    user: {
      id: "user2",
      name: "Jane Smith",
      email: "jane@example.com",
    },
  },
  {
    id: "3",
    rating: 3.5,
    content:
      "Good product overall, but there's room for improvement in the packaging. The item itself is fine, just wish it came better protected.",
    createdAt: new Date("2024-11-05"),
    user: {
      id: "user3",
      email: "alex@example.com",
    },
  },
];
