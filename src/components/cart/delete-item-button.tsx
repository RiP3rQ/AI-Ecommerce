"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useCart } from "@/providers/cart-provider";
import { SelectCartItem } from "@/types/cart";

export function DeleteItemButton({ item }: { item: SelectCartItem }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { removeItem } = useCart();
  const cartItemId = item.id;

  if (!cartItemId) {
    console.error("Cart item ID is missing");
    return null;
  }

  const handleRemove = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await removeItem(cartItemId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove item";
      setError(errorMessage);
      console.error("Error removing item:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleRemove}
        disabled={isLoading}
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500 disabled:opacity-50"
      >
        <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
      {error && (
        <p aria-live="polite" className="sr-only" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
