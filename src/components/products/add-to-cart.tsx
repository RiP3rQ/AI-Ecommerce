"use client";

import { SelectProductVariant } from "@/database/schema";
import { ProductData } from "@/app/api/product/[id]/types";
import { useCart } from "@/providers/cart-provider";
import { useProductProvider } from "@/providers/product-provider";
import { addItemToCart } from "@/lib/cart-api";
import clsx from "clsx";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  isLoading,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  isLoading: boolean;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white cursor-pointer";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Add to cart"
      disabled={isLoading}
      className={clsx(buttonClasses, {
        "hover:opacity-90": !isLoading,
        "opacity-60": isLoading,
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      {isLoading ? "Adding..." : "Add To Cart"}
    </button>
  );
}

export function AddToCart({
  product,
  variants,
}: {
  product: ProductData;
  variants: SelectProductVariant[];
}) {
  const { availableForSale } = product;
  const { addCartItem, refreshCart } = useCart();
  const { state } = useProductProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variant = variants.find((variant: SelectProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()],
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  // Get featured image from product images
  const featuredImage =
    product.product_images.length > 0
      ? {
          url: product.product_images[0].url,
          altText: product.product_images[0].altText || undefined,
          width: product.product_images[0].width || undefined,
          height: product.product_images[0].height || undefined,
        }
      : undefined;

  const handleAddToCart = async () => {
    if (!selectedVariantId || isLoading) return;

    setIsLoading(true);
    setError(null);
    addCartItem(finalVariant, product, featuredImage);

    try {
      await addItemToCart({
        productVariantId: selectedVariantId,
        quantity: 1,
      });
      refreshCart();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add item";
      setError(errorMessage);
      console.error("Error adding to cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div onClick={handleAddToCart}>
        <SubmitButton
          availableForSale={availableForSale}
          selectedVariantId={selectedVariantId}
          isLoading={isLoading}
        />
      </div>
      {error && (
        <p aria-live="polite" className="text-sm text-red-500 mt-2">
          {error}
        </p>
      )}
      <p aria-live="polite" className="sr-only" role="status">
        {!error && !isLoading && "Item added to cart"}
      </p>
    </div>
  );
}
