"use client";

import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  /** Current rating value (0-5 with 0.5 increments) */
  value: number;
  /** Callback when rating changes (only for interactive mode) */
  onChange?: (rating: number) => void;
  /** Whether the component is interactive (clickable) */
  readonly isInteractive?: boolean;
  /** Size of the stars */
  readonly size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  readonly className?: string;
}

/**
 * StarRating component for displaying and selecting star ratings.
 * Supports ratings from 0-5 with 0.5 increments.
 */
export function StarRating({
  value,
  onChange,
  isInteractive = false,
  size = "md",
  className,
}: StarRatingProps): ReactNode {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleStarClick = (starIndex: number, isHalf: boolean) => {
    if (!isInteractive || !onChange) return;
    const rating = starIndex + (isHalf ? 0.5 : 1);
    onChange(rating);
  };

  const handleMouseEnter = (starIndex: number, isHalf: boolean) => {
    if (!isInteractive) return;
    setHoverRating(starIndex + (isHalf ? 0.5 : 1));
  };

  const handleMouseLeave = () => {
    if (!isInteractive) return;
    setHoverRating(null);
  };

  const getStarFill = (starIndex: number): "empty" | "half" | "full" => {
    const currentRating = hoverRating ?? value;
    const starValue = starIndex + 1;

    if (currentRating >= starValue) return "full";
    if (currentRating >= starValue - 0.5) return "half";
    return "empty";
  };

  const renderStar = (starIndex: number): ReactNode => {
    const fill = getStarFill(starIndex);

    return (
      <div
        key={starIndex}
        className={cn(
          "relative inline-block",
          isInteractive && "cursor-pointer",
        )}
        onMouseLeave={handleMouseLeave}
      >
        {/* Empty star background */}
        <svg
          className={cn(
            "text-neutral-300 dark:text-neutral-600",
            sizeClasses[size],
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>

        {/* Filled star overlay */}
        {fill === "full" && (
          <div className="absolute inset-0">
            <svg
              className={cn("text-yellow-400", sizeClasses[size])}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )}

        {/* Half-filled star overlay (left half only) */}
        {fill === "half" && (
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <svg
              className={cn("text-yellow-400", sizeClasses[size])}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )}

        {/* Interactive areas for half-star precision */}
        {isInteractive && (
          <>
            {/* Left half */}
            <div
              className="absolute inset-0 w-1/2"
              onMouseEnter={() => handleMouseEnter(starIndex, true)}
              onClick={() => handleStarClick(starIndex, true)}
            />
            {/* Right half */}
            <div
              className="absolute inset-0 w-1/2 left-1/2"
              onMouseEnter={() => handleMouseEnter(starIndex, false)}
              onClick={() => handleStarClick(starIndex, false)}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {[0, 1, 2, 3, 4].map(renderStar)}
      <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
        {value > 0 ? `${value} stars` : "No rating"}
      </span>
    </div>
  );
}
