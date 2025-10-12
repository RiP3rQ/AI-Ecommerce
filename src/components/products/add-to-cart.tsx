"use client";

import { SelectProductVariant } from "@/database/schema";
import { GetProductDataReturnType } from "@/app/(protected-main)/product/[productUuid]/actions";
import { useCart } from "@/providers/cart-provider";
import { useProduct } from "@/providers/product-provider";
import clsx from "clsx";
import { PlusIcon } from "lucide-react";
import { useActionState } from "react";
import { addItem } from "./actions";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white";
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
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({
  product,
  variants,
}: {
  product: GetProductDataReturnType;
  variants: SelectProductVariant[];
}) {
  const { availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: SelectProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
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

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product, featuredImage);
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        Item added to cart
      </p>
    </form>
  );
}
