"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { removeCartItem } from "@/lib/cart-api";
import { SelectCartItem } from "@/types/cart";

export function DeleteItemButton({
  item,
  optimisticUpdate,
  refreshCart,
}: {
  item: SelectCartItem;
  optimisticUpdate: (merchandiseId: string, updateType: "delete") => void;
  refreshCart: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cartItemId = item.id;
  const merchandiseId = item.merchandise.id;

  if (!cartItemId) {
    console.error("Cart item ID is missing");
    return null;
  }

  const handleRemove = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    optimisticUpdate(merchandiseId, "delete");

    try {
      await removeCartItem({ cartItemId });
      refreshCart();
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
