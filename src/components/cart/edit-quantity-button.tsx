"use client";

import type { SelectCartItem } from "@/types/cart";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";
import { useCart } from "@/providers/cart-provider";

function SubmitButton({
  type,
  disabled,
}: {
  type: "plus" | "minus";
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx(
        "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80 disabled:opacity-50",
        {
          "ml-auto": type === "minus",
        },
      )}
    >
      {type === "plus" ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
}: {
  item: SelectCartItem;
  type: "plus" | "minus";
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateItemQuantity } = useCart();

  if (!item.id) {
    console.error("Cart item ID is missing");
    return null;
  }

  const cartItemId = item.id;
  const newQuantity = type === "plus" ? item.quantity + 1 : item.quantity - 1;

  const handleUpdate = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await updateItemQuantity(cartItemId, newQuantity);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update quantity";
      setError(errorMessage);
      console.error("Error updating quantity:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div onClick={handleUpdate}>
        <SubmitButton type={type} disabled={isLoading} />
      </div>
      {error && (
        <p aria-live="polite" className="sr-only" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
