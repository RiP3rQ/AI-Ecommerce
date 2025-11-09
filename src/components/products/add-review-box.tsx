"use client";

import { type ReactNode, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";

/**
 * Schema for review form validation.
 */
const reviewFormSchema = z.object({
  content: z
    .string()
    .min(10, "Review must be at least 10 characters long")
    .max(1000, "Review cannot exceed 1000 characters"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface AddReviewBoxProps {
  /** Product UUID for which the review is being added */
  readonly productUuid: string;
  /** Callback when a review is successfully submitted */
  readonly onReviewSubmitted?: () => void;
  /** Additional CSS classes */
  readonly className?: string;
}

/**
 * Component for adding a new product review.
 * Includes rating selection and content input with validation.
 */
export function AddReviewBox({
  productUuid,
  onReviewSubmitted,
  className,
}: AddReviewBoxProps): ReactNode {
  const [formData, setFormData] = useState<ReviewFormData>({
    content: "",
    rating: 0,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ReviewFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (
    field: keyof ReviewFormData,
    value: string | number,
  ) => {
    try {
      const fieldSchema = reviewFormSchema.shape[field];
      fieldSchema.parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.issues[0]?.message }));
      }
      return false;
    }
  };

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
    validateField("content", value);
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
    validateField("rating", rating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate entire form
    const result = reviewFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ReviewFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ReviewFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Submit review to API
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productUuid,
          ...formData,
        }),
      });

      if (response.ok) {
        // Success
        toast.success("Review submitted successfully!");
        setFormData({
          content: "",
          rating: 0,
        });
        setErrors({});
        onReviewSubmitted?.();
      } else {
        // Handle API errors
        try {
          const errorData = await response.json();
          const errorMessage =
            errorData.message || "Failed to submit review. Please try again.";
          toast.error(errorMessage);
        } catch (parseError) {
          // If we can't parse the error response, show a generic message
          toast.error("Failed to submit review. Please try again.");
        }
      }
    } catch (error) {
      // Network or other errors
      const errorMessage =
        "Network error. Please check your connection and try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.content.trim().length >= 10 && formData.rating >= 1;

  return (
    <Card className={cn("w-full", className)} id="onboarding-tour-step-7">
      <CardHeader>
        <CardTitle className="text-lg">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Rating *
            </label>
            <div className="flex items-center gap-4">
              <StarRating
                value={formData.rating.toString()}
                onChange={handleRatingChange}
                isInteractive
                size="lg"
              />
            </div>
            {errors.rating && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.rating}
              </p>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-2">
            <label
              htmlFor="review-content"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Review *
            </label>
            <Textarea
              id="review-content"
              placeholder="Share your experience with this product..."
              value={formData.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className={cn(
                "min-h-[120px] resize-none",
                errors.content && "border-red-500 focus-visible:ring-red-500",
              )}
              disabled={isSubmitting}
              maxLength={1000}
              minLength={10}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {formData.content.length}/1000 characters
              </span>
              {errors.content && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.content}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
