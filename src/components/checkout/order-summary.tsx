"use client";

import type { ReactNode } from "react";
import { useCartState } from "@/providers/cart-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Price } from "@/components/custom-price";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Component that displays the order summary with totals.
 * Shows subtotal, shipping costs (mocked as free), and final total.
 */
export function OrderSummary(): ReactNode {
  const { cart, isLoading } = useCartState();

  if (isLoading || !cart) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Separator />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-14" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between">
          <span className="text-sm">Subtotal</span>
          <Price
            amount={cart.cost.subtotalAmount.amount}
            currencyCode={cart.cost.subtotalAmount.currencyCode}
            className="text-sm"
          />
        </div>

        <Separator />

        {/* Shipping */}
        <div className="flex justify-between">
          <span className="text-sm">Shipping</span>
          <span className="text-sm text-green-600 dark:text-green-400">
            Free
          </span>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <Price
            amount={cart.cost.totalAmount.amount}
            currencyCode={cart.cost.totalAmount.currencyCode}
            className="text-lg"
          />
        </div>
      </CardContent>
    </Card>
  );
}
