"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Price } from "@/components/custom-price";
import { Plus, Loader2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductVariant {
  id: string;
  title: string;
  price: number;
  currencyCode: string;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
  inventoryQuantity?: number | null;
}

interface ProductWithVariants {
  id: string;
  title: string;
  description?: string | null;
  tags: string[] | null;
  variants: ProductVariant[];
}

interface SelectedProduct {
  productId: string;
  variantId: string;
  quantity: number;
}

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductWithVariants[];
  onConfirm: (selectedItems: SelectedProduct[]) => void;
  isLoading?: boolean;
}

export function AddToCartModal({
  isOpen,
  onClose,
  products,
  onConfirm,
  isLoading = false,
}: AddToCartModalProps) {
  const [selectedItems, setSelectedItems] = useState<
    Map<string, SelectedProduct>
  >(new Map());

  // Initialize selected items when modal opens
  useEffect(() => {
    if (isOpen && products.length > 0) {
      const initialSelections = new Map<string, SelectedProduct>();
      products.forEach((product) => {
        // Auto-select first available variant
        const firstAvailableVariant = product.variants.find(
          (v) => v.availableForSale,
        );
        if (firstAvailableVariant) {
          initialSelections.set(product.id, {
            productId: product.id,
            variantId: firstAvailableVariant.id,
            quantity: 1,
          });
        }
      });
      setSelectedItems(initialSelections);
    } else {
      setSelectedItems(new Map());
    }
  }, [isOpen, products]);

  const handleVariantChange = (productId: string, variantId: string) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(productId);
      if (existing) {
        newMap.set(productId, { ...existing, variantId });
      }
      return newMap;
    });
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(productId);
      if (existing) {
        newMap.set(productId, { ...existing, quantity });
      }
      return newMap;
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      newMap.delete(productId);
      return newMap;
    });
  };

  const handleConfirm = () => {
    if (selectedItems.size > 0 && !isLoading) {
      onConfirm(Array.from(selectedItems.values()));
    }
  };

  const getVariantOptions = (product: ProductWithVariants) => {
    // Group options by name
    const optionsByName = new Map<string, Set<string>>();
    product.variants.forEach((variant) => {
      variant.selectedOptions.forEach((option) => {
        if (!optionsByName.has(option.name)) {
          optionsByName.set(option.name, new Set());
        }
        optionsByName.get(option.name)!.add(option.value);
      });
    });
    return optionsByName;
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Products to Cart</DialogTitle>
          <DialogDescription>
            Select variants and quantities for each product you want to add.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 pr-4">
            {products.map((product) => {
              const selection = selectedItems.get(product.id);
              const isSelected = !!selection;
              const selectedVariant = selection
                ? product.variants.find((v) => v.id === selection.variantId)
                : null;
              const hasMultipleVariants = product.variants.length > 1;
              const optionsByName = getVariantOptions(product);

              return (
                <div
                  key={product.id}
                  className={`rounded-lg border p-4 transition-colors ${
                    isSelected
                      ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">
                        {product.title}
                      </h3>
                      {product.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="ml-2"
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {isSelected && (
                    <div className="mt-4 space-y-3">
                      {/* Variant Selection */}
                      {hasMultipleVariants && (
                        <div className="space-y-2">
                          {Array.from(optionsByName.entries()).map(
                            ([optionName, values]) => (
                              <div key={optionName}>
                                <label className="text-sm font-medium mb-1 block">
                                  {optionName}
                                </label>
                                <Select
                                  value={selection.variantId}
                                  onValueChange={(variantId) =>
                                    handleVariantChange(product.id, variantId)
                                  }
                                  disabled={isLoading}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {product.variants.map((variant) => {
                                      const optionValue =
                                        variant.selectedOptions.find(
                                          (opt) => opt.name === optionName,
                                        )?.value;
                                      if (!optionValue) return null;

                                      return (
                                        <SelectItem
                                          key={variant.id}
                                          value={variant.id}
                                          disabled={!variant.availableForSale}
                                        >
                                          <div className="flex items-center justify-between w-full">
                                            <span>{optionValue}</span>
                                            <Price
                                              amount={variant.price.toString()}
                                              currencyCode={
                                                variant.currencyCode
                                              }
                                              className="ml-2 text-xs"
                                            />
                                          </div>
                                          {!variant.availableForSale &&
                                            " (Out of Stock)"}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                              </div>
                            ),
                          )}
                        </div>
                      )}

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">
                            Quantity:
                          </label>
                          <Select
                            value={selection.quantity.toString()}
                            onValueChange={(value) =>
                              handleQuantityChange(product.id, parseInt(value))
                            }
                            disabled={isLoading}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {selectedVariant && (
                          <Price
                            amount={(
                              selectedVariant.price * selection.quantity
                            ).toString()}
                            currencyCode={selectedVariant.currencyCode}
                            className="font-semibold"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {!isSelected && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const firstAvailable = product.variants.find(
                          (v) => v.availableForSale,
                        );
                        if (firstAvailable) {
                          setSelectedItems((prev) => {
                            const newMap = new Map(prev);
                            newMap.set(product.id, {
                              productId: product.id,
                              variantId: firstAvailable.id,
                              quantity: 1,
                            });
                            return newMap;
                          });
                        }
                      }}
                      className="mt-3"
                      disabled={
                        isLoading ||
                        !product.variants.some((v) => v.availableForSale)
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add this product
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedItems.size === 0 || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add {selectedItems.size}{" "}
                {selectedItems.size === 1 ? "Item" : "Items"} to Cart
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
