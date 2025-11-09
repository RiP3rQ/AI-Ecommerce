"use client";

import { type ReactNode, Suspense, useState } from "react";
import { Gallery } from "./gallery";
import { ProductDescription } from "./description";
import { AddReviewBox } from "./add-review-box";
import { ReviewsList } from "./reviews-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, RefreshCw, MessageCircle, Send } from "lucide-react";
import type { SelectProductImage } from "@/database/schema";
import useSWR, { type SWRResponse } from "swr";
import type { ProductData } from "@/app/api/product/[id]/types";
import { swrFetcher } from "@/lib/swr-fetcher";
import { BASE_URL } from "@/lib/utils";
import type { ReviewsResponse } from "@/app/api/review/types";
import type { ReviewSummaryData } from "@/app/api/ai/summorize-reviews/types";
import type { AskReviewsResponse } from "@/app/api/ai/ask-reviews/types";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { toast } from "sonner";

export function ProductDetails({
  productUuid,
}: Readonly<{ productUuid: string }>): ReactNode {
  // State for review summary
  const [summary, setSummary] = useState<ReviewSummaryData | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // State for Q&A functionality (only if feature is enabled)
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<{
    answer: string;
    relevantReviews: Array<{
      id: string;
      content: string;
      rating: string;
      similarity: number;
    }>;
    confidence: "high" | "medium" | "low";
    totalReviewsFound: number;
  } | null>(null);
  const [isAsking, setIsAsking] = useState(false);

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

  // Function to generate review summary (only if feature is enabled)
  const handleSummarizeReviews = async () => {
    if (!isFeatureEnabled("aiSummarizeReviews")) return;

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
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));

        // Handle rate limiting specially
        if (response.status === 429) {
          toast.error("AI usage limit reached", {
            description:
              "You've reached your monthly AI usage limit. Please try again next month.",
            duration: 6000,
          });
          return;
        }

        // Handle other errors
        toast.error("Failed to generate summary", {
          description: errorData.message || "Please try again later.",
        });
        return;
      }

      const result = await response.json();
      setSummary(result.data);
    } catch (error) {
      console.error("Failed to summarize reviews:", error);
      toast.error("Connection error", {
        description:
          "Unable to connect to the server. Please check your internet connection and try again.",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  // Function to ask questions about reviews (only if feature is enabled)
  const handleAskQuestion = async () => {
    if (!isFeatureEnabled("aiAskReviews") || !question.trim()) return;

    setIsAsking(true);
    try {
      const response = await fetch(`${BASE_URL}/api/ai/ask-reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productUuid,
          question: question.trim(),
          maxReviews: 5,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));

        // Handle rate limiting specially
        if (response.status === 429) {
          toast.error("AI usage limit reached", {
            description:
              "You've reached your monthly AI usage limit. Please try again next month.",
            duration: 6000,
          });
          return;
        }

        // Handle other errors
        toast.error("Failed to get answer", {
          description: errorData.message || "Please try again later.",
        });
        return;
      }

      const result: AskReviewsResponse = await response.json();
      setAnswer(result.data);

      // Reset question
      setQuestion("");
    } catch (error) {
      console.error("Failed to ask question:", error);
      toast.error("Connection error", {
        description:
          "Unable to connect to the server. Please check your internet connection and try again.",
      });
    } finally {
      setIsAsking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          {/* Gallery Skeleton */}
          <div className="h-full w-full basis-full lg:basis-4/6">
            <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>
          </div>

          {/* Product Description Skeleton */}
          <div className="basis-full lg:basis-2/6 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>

        {/* Reviews Section Skeleton */}
        <div className="mt-12 mb-12 space-y-8">
          {/* Add Review Box Skeleton */}
          <div className="h-64 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />

          {/* Review Summary Skeleton */}
          {isFeatureEnabled("aiSummarizeReviews") && (
            <div className="border border-neutral-200 rounded-lg p-6 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          )}

          {/* Ask Reviews Section Skeleton */}
          {isFeatureEnabled("aiAskReviews") && (
            <div className="border border-neutral-200 rounded-lg p-6 dark:border-neutral-800">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-28" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          )}

          {/* Reviews List Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error.message}</div>;

  if (!data || !data.data) return <div>No data</div>;

  const productData = data.data;

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4">
      <div
        className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black"
        id="onboarding-tour-step-4"
      >
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

        <div className="basis-full lg:basis-2/6" id="onboarding-tour-step-5">
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
        {isFeatureEnabled("aiSummarizeReviews") && (
          <ReviewSummarySection
            summary={summary}
            isSummarizing={isSummarizing}
            onSummarize={handleSummarizeReviews}
            hasReviews={Boolean(reviewsData?.data?.reviews?.length)}
          />
        )}

        {/* Ask Reviews Section */}
        {isFeatureEnabled("aiAskReviews") && (
          <AskReviewsSection
            question={question}
            answer={answer}
            isAsking={isAsking}
            onQuestionChange={setQuestion}
            onAskQuestion={handleAskQuestion}
            hasReviews={Boolean(reviewsData?.data?.reviews?.length)}
          />
        )}

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
    <Card className="w-full" id="onboarding-tour-step-9">
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
              Based on {summary.reviewCount} customer review
              {summary.reviewCount !== 1 ? "s" : ""}
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
            Click "Summarize Reviews" to generate an AI-powered summary of all
            customer reviews for this product.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Component for asking questions about reviews and displaying AI answers.
 */
function AskReviewsSection({
  question,
  answer,
  isAsking,
  onQuestionChange,
  onAskQuestion,
  hasReviews,
}: Readonly<{
  question: string;
  answer: {
    answer: string;
    relevantReviews: Array<{
      id: string;
      content: string;
      rating: string;
      similarity: number;
    }>;
    confidence: "high" | "medium" | "low";
    totalReviewsFound: number;
  } | null;
  isAsking: boolean;
  onQuestionChange: (question: string) => void;
  onAskQuestion: () => void;
  hasReviews: boolean;
}>): ReactNode {
  if (!hasReviews) {
    return null; // Don't show if no reviews exist
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAskQuestion();
    }
  };

  const getConfidenceColor = (confidence: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high":
        return "text-green-600 dark:text-green-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "low":
        return "text-red-600 dark:text-red-400";
    }
  };

  const getConfidenceText = (confidence: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high":
        return "High confidence";
      case "medium":
        return "Medium confidence";
      case "low":
        return "Low confidence";
    }
  };

  return (
    <Card className="w-full" id="onboarding-tour-step-8">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Ask About This Product
        </CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Get answers about fit, sizing, colors, and more from real customer
          reviews
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="e.g., How does this shirt fit? Is the color as shown? Does it run true to size?"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[80px] resize-none"
            disabled={isAsking}
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {question.length}/500 characters
            </span>
            <Button
              onClick={onAskQuestion}
              disabled={!question.trim() || isAsking || question.length < 5}
              size="sm"
            >
              {isAsking ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Thinking...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Ask Question
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Answer Display */}
        {answer && (
          <div className="border-t pt-4 space-y-4">
            {/* Answer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                  AI Answer
                </h4>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(
                    answer.confidence,
                  )} bg-neutral-100 dark:bg-neutral-800`}
                >
                  {getConfidenceText(answer.confidence)}
                </span>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {answer.answer}
              </p>
            </div>

            {/* Relevant Reviews */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Based on {answer.relevantReviews.length} relevant review
                {answer.relevantReviews.length !== 1 ? "s" : ""} (out of{" "}
                {answer.totalReviewsFound} total)
              </h5>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {answer.relevantReviews.map((review, index) => (
                  <div
                    key={review.id}
                    className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Review {index + 1} • {review.rating} stars
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {Math.round(review.similarity * 100)}% relevant
                      </span>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 line-clamp-3">
                      {review.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Helper Text */}
        {!answer && !isAsking && (
          <div className="text-center py-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Ask specific questions about fit, sizing, colors, quality, or any
              other aspect of this product. Our AI will search through customer
              reviews to provide you with detailed, experience-based answers.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
