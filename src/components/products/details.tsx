"use client";

import { type ReactNode, Suspense, useState } from "react";
import { Gallery } from "./gallery";
import { ProductDescription } from "./description";
import { AddReviewBox } from "./add-review-box";
import { ReviewsList } from "./reviews-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, RefreshCw } from "lucide-react";
import type { SelectProductImage } from "@/database/schema";
import useSWR, { type SWRResponse } from "swr";
import type { ProductData } from "@/app/api/product/[id]/types";
import { swrFetcher } from "@/lib/swr-fetcher";
import { BASE_URL } from "@/lib/utils";
import { ReviewsResponse } from "@/app/api/review/types";
import type { ReviewSummaryData } from "@/app/api/ai/summorize-reviews/types";

export function ProductDetails({
  productUuid,
}: Readonly<{ productUuid: string }>): ReactNode {
  // State for review summary
  const [summary, setSummary] = useState<ReviewSummaryData | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Fetch product data
  const { data, isLoading, error } = useSWR<SWRResponse<ProductData>>(
    `${BASE_URL}/api/product/${productUuid}`,
    swrFetcher,
  );

  // Fetch reviews for this product
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    mutate: mutateReviews,
  } = useSWR<ReviewsResponse>(
    productUuid ? `${BASE_URL}/api/review?productId=${productUuid}` : null,
    swrFetcher,
  );

  // Function to generate review summary
  const handleSummarizeReviews = async () => {
    setIsSummarizing(true);
    try {
      const response = await fetch(`${BASE_URL}/api/ai/summorize-reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productUuid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const result = await response.json();
      setSummary(result.data);
    } catch (error) {
      console.error("Failed to summarize reviews:", error);
      // Could add toast notification here
    } finally {
      setIsSummarizing(false);
    }
  };

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
          <AddReviewBox
            productUuid={productUuid}
            onReviewSubmitted={mutateReviews}
          />
        </Suspense>

        {/* Review Summary */}
        <ReviewSummarySection
          summary={summary}
          isSummarizing={isSummarizing}
          onSummarize={handleSummarizeReviews}
          hasReviews={Boolean(reviewsData?.data?.reviews?.length)}
        />

        {/* Reviews List */}
        <Suspense
          fallback={
            <div className="h-96 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />
          }
        >
          <ReviewsList
            reviews={reviewsData?.data?.reviews}
            isLoading={reviewsLoading}
          />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * Component for displaying and generating review summaries.
 */
function ReviewSummarySection({
  summary,
  isSummarizing,
  onSummarize,
  hasReviews,
}: Readonly<{
  summary: ReviewSummaryData | null;
  isSummarizing: boolean;
  onSummarize: () => void;
  hasReviews: boolean;
}>): ReactNode {
  if (!hasReviews) {
    return null; // Don't show if no reviews exist
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Review Summary
          </CardTitle>
          <Button
            onClick={onSummarize}
            disabled={isSummarizing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isSummarizing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : summary ? (
              <>
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Summarize Reviews
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isSummarizing ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : summary ? (
          <div className="space-y-3">
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {summary.summary}
            </p>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Based on {summary.reviewCount} customer review{summary.reviewCount !== 1 ? 's' : ''}
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
            Click "Summarize Reviews" to generate an AI-powered summary of all customer reviews for this product.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
