"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useCart } from "@/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Price } from "@/components/custom-price";
import { Minus, Plus, Trash2 } from "lucide-react";

/**
 * Component that displays the list of items in the user's cart.
 * Shows product images, names, variants, quantities, and prices.
 * Includes controls to modify quantities or remove items.
 */
export function CartItemList(): ReactNode {
  const { cart, updateItemQuantity, removeItem, isLoading, error } = useCart();

  if (error) {
    return (
      <Card className="p-6">
        <CardContent className="text-center text-red-600 dark:text-red-400">
          Failed to load cart items. Please try again.
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !cart) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4">
            <CardContent className="flex space-x-4">
              <Skeleton className="h-16 w-16 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <Card className="p-6">
        <CardContent className="text-center text-muted-foreground">
          Your cart is empty.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {cart.lines.map((item) => {
        const hasImage = !!item.merchandise.product.featuredImage?.url;

        return (
          <Card key={item.id} className="p-4">
            <CardContent className="flex items-center space-x-4">
              {/* Product Image */}
              <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded border">
                {hasImage ? (
                  <Image
                    src={item.merchandise.product.featuredImage?.url || ""}
                    alt={item.merchandise.product.featuredImage?.altText || ""}
                    fill
                    sizes="128px"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <span className="text-lg">📦</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">
                  {item.merchandise.product.title}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.merchandise.selectedOptions.map((option, index) => (
                    <span
                      key={index}
                      className="inline-block text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
                    >
                      {option.name}: {option.value}
                    </span>
                  ))}
                </div>
                <Price
                  amount={item.cost.totalAmount.amount}
                  currencyCode={item.cost.totalAmount.currencyCode}
                  className="text-sm font-medium mt-1"
                />
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateItemQuantity(item.id!, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateItemQuantity(item.id!, item.quantity + 1)
                  }
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(item.id!)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
