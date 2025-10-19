"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/providers/cart-provider";
import { addItemToCart } from "@/lib/cart-api";
import { Price } from "@/components/custom-price";
import { cn } from "@/lib/utils";
import { ShoppingCart, Plus } from "lucide-react";
import type { ProductWithDetails } from "@/app/api/shop/types";
import type { SelectProductVariant } from "@/database/schemas/product-variants";
import type { SelectProductOption } from "@/database/schemas/product-options";

/**
 * Extended product type that includes variants and options for checkout functionality.
 */
interface ProductWithVariantsAndOptions extends ProductWithDetails {
  variants: SelectProductVariant[];
  options: SelectProductOption[];
}

interface ProductCardWithAddToCartProps {
  product: ProductWithVariantsAndOptions;
  priority?: boolean;
}

/**
 * Product card component with add-to-cart functionality.
 * Shows a modal for variant selection if the product has options,
 * otherwise adds directly to cart.
 */
export function ProductCardWithAddToCart({
  product,
  priority = false,
}: ProductCardWithAddToCartProps): ReactNode {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addCartItem, refreshCart } = useCart();

  const hasImage = !!product.featuredImage?.url;
  const hasVariants = product.variants && product.variants.length > 0;
  const hasOptions = product.options && product.options.length > 0;

  // If product has variants with options, show modal for selection
  const needsVariantSelection = hasVariants && hasOptions && product.options.some((option: SelectProductOption) => option.values.length > 1);

  const handleAddToCart = async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      let variantId: string;

      if (needsVariantSelection && selectedVariantId) {
        variantId = selectedVariantId;
      } else if (hasVariants && product.variants[0]) {
        // Use first variant if no selection needed
        variantId = product.variants[0].id;
      } else {
        // Fallback - this shouldn't happen with proper data
        throw new Error("No variant available");
      }

      const variant = product.variants.find((v: SelectProductVariant) => v.id === variantId);
      if (!variant) throw new Error("Selected variant not found");

      // Add to cart using the cart provider
      addCartItem(variant, product, product.featuredImage ? {
        url: product.featuredImage.url,
        altText: product.featuredImage.altText || undefined,
        width: product.featuredImage.width || undefined,
        height: product.featuredImage.height || undefined,
      } : undefined);

      // Also call the API directly
      await addItemToCart({
        productVariantId: variantId,
        quantity: 1,
      });

      refreshCart();
      setIsModalOpen(false);
      setSelectedVariantId("");
    } catch (error) {
      console.error("Error adding to cart:", error);
      // TODO: Show error toast
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleDirectAddToCart = () => {
    if (needsVariantSelection) {
      setIsModalOpen(true);
    } else {
      handleAddToCart();
    }
  };

  return (
    <>
      <Card className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:border-blue-600 hover:shadow-lg dark:border-neutral-800 dark:bg-black dark:hover:border-blue-500">
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          {hasImage ? (
            <Image
              src={product.featuredImage?.url || ""}
              alt={product.featuredImage?.altText || ""}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              priority={priority}
              className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-4xl text-neutral-400 dark:text-neutral-600">
                📦
              </span>
            </div>
          )}

          {/* Availability Badge */}
          {!product.availableForSale && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Badge variant="destructive" className="text-sm font-semibold">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <CardContent className="flex flex-1 flex-col justify-between p-4">
          <div className="mb-2">
            <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {product.title}
            </h3>
            {product.description && (
              <p className="mt-1 line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400">
                {product.description}
              </p>
            )}
          </div>

          {/* Price */}
          {product.minPrice !== undefined &&
            product.maxPrice !== undefined &&
            product.currencyCode && (
              <div className="mt-auto mb-3">
                <Price
                  amount={product.minPrice.toString()}
                  currencyCode={product.currencyCode}
                  className={cn(
                    "text-base font-bold",
                    !product.availableForSale &&
                      "text-neutral-400 dark:text-neutral-600",
                  )}
                />
              </div>
            )}

          {/* Add to Cart Button */}
          {product.availableForSale && (
            <Button
              onClick={handleDirectAddToCart}
              disabled={isAddingToCart}
              className="w-full"
              size="sm"
            >
              {isAddingToCart ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Variant Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Options</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Product Info */}
            <div className="flex items-center space-x-3">
              {hasImage && (
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border">
                  <Image
                    src={product.featuredImage?.url || ""}
                    alt={product.featuredImage?.altText || ""}
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
              )}
              <div>
                <h3 className="font-medium text-sm">{product.title}</h3>
                {product.minPrice !== undefined && product.currencyCode && (
                  <Price
                    amount={product.minPrice.toString()}
                    currencyCode={product.currencyCode}
                    className="text-sm text-muted-foreground"
                  />
                )}
              </div>
            </div>

            {/* Variant Selection */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-3">
                {product.options.map((option: SelectProductOption) => (
                  <div key={option.id}>
                    <label className="text-sm font-medium mb-2 block">
                      {option.name}
                    </label>
                    <Select
                      value={selectedVariantId}
                      onValueChange={setSelectedVariantId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${option.name.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {option.values.map((value: string) => {
                          // Find matching variant for this option value
                          const matchingVariant = product.variants.find((variant: SelectProductVariant) =>
                            variant.selectedOptions.some((opt) =>
                              opt.name.toLowerCase() === option.name.toLowerCase() &&
                              opt.value === value
                            )
                          );

                          return (
                            <SelectItem
                              key={value}
                              value={matchingVariant?.id || ""}
                              disabled={!matchingVariant?.availableForSale}
                            >
                              {value}
                              {!matchingVariant?.availableForSale && " (Out of Stock)"}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariantId || isAddingToCart}
                className="flex-1"
              >
                {isAddingToCart ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
