"use client";

import { SelectCartItem } from "@/types/cart";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";
import { updateCartItemQuantity, removeCartItem } from "@/lib/cart-api";

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
        }
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
  optimisticUpdate,
}: {
  item: SelectCartItem;
  type: "plus" | "minus";
  optimisticUpdate: (
    merchandiseId: string,
    updateType: "plus" | "minus"
  ) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const merchandiseId = item.merchandise.id;

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
    optimisticUpdate(merchandiseId, type);

    try {
      if (newQuantity === 0) {
        await removeCartItem({ cartItemId });
      } else {
        await updateCartItemQuantity({
          cartItemId,
          quantity: newQuantity,
        });
      }
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
