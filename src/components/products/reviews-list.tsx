"use client";

import { type ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { ReviewWithUser } from "@/app/api/review/types";

/**
 * Review data structure.
 * Note: This will be replaced with the actual type from the database schema once available.
 */
export interface Review {
  id: string;
  rating: number;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name?: string;
    email: string;
  };
}

interface ReviewsListProps {
  /** Array of reviews to display */
  readonly reviews?: ReviewWithUser[];
  /** Whether reviews are currently loading */
  readonly isLoading?: boolean;
  /** Additional CSS classes */
  readonly className?: string;
}

/**
 * Component for displaying a list of product reviews.
 * Shows reviews in a modern card layout with ratings and user information.
 */
export function ReviewsList({
  reviews,
  isLoading = false,
  className,
}: ReviewsListProps): ReactNode {
  if (isLoading) {
    return <ReviewsListSkeleton className={className} />;
  }

  if (!reviews) {
    return null;
  }

  if (reviews.length === 0) {
    return (
      <Empty className={className}>
        <EmptyTitle>No reviews yet</EmptyTitle>
        <EmptyDescription>
          Be the first to review this product!
        </EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Customer Reviews ({reviews.length})
        </h3>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual review card component.
 */
function ReviewCard({
  review,
}: Readonly<{ review: ReviewWithUser }>): ReactNode {
  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {review.user.email}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {formattedDate}
            </p>
          </div>
          <StarRating value={review.rating} size="sm" className="text-sm" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {review.content}
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton loader for the reviews list.
 */
function ReviewsListSkeleton({ className }: { className?: string }): ReactNode {
  return (
    <div className={cn("space-y-4", className)}>
      <Skeleton className="h-6 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="pb-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
