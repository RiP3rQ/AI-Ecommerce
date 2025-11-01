"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, type ReactNode } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Truck, CreditCard } from "lucide-react";
import LoadingDots from "@/components/loading-dots";
import { Price } from "@/components/custom-price";
import { BASE_URL } from "@/lib/utils";
import {
  type OrderDetails,
  OrderDetailsResponse,
} from "@/app/api/order/[id]/dto";
import type { SWRResponse } from "@/types/swr";
import { swrFetcher } from "@/lib/swr-fetcher";
import { useCart } from "@/providers/cart-provider";

export function CheckoutComplete(): ReactNode {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const orderId = searchParams.get("orderId");

  const {
    data: orderResponse,
    error,
    isLoading,
  } = useSWR<SWRResponse<OrderDetails>>(
    orderId ? `${BASE_URL}/api/order/${orderId}` : null,
    swrFetcher,
  );

  const order = useMemo(() => orderResponse?.data, [orderResponse]);

  useEffect(() => {
    if (order?.id) {
      void clearCart();
    }
  }, [order]);

  if (isLoading || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingDots className="bg-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error || !orderResponse?.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Order Not Found
          </h1>
          <p className="text-muted-foreground">
            We couldn't find your order. Please contact support if you believe
            this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Thank you for your purchase!
        </h1>
        <p className="text-lg text-muted-foreground">
          Your order has been successfully placed and is being processed.
        </p>
      </div>

      {/* Order Confirmation Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Order Number
              </p>
              <p className="font-mono text-sm">
                {order.id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Order Date
              </p>
              <p className="text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge
                variant={order.status === "completed" ? "default" : "secondary"}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {item.featuredImage ? (
                    <img
                      src={item.featuredImage.url}
                      alt={
                        item.featuredImage.altText ||
                        item.productVariant.product.title
                      }
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">
                    {item.productVariant.product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.productVariant.title}
                  </p>
                  {item.productVariant.selectedOptions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.productVariant.selectedOptions.map(
                        (option, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {option.name}: {option.value}
                          </Badge>
                        ),
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                    <Price
                      amount={item.priceAtPurchase.toString()}
                      currencyCode={item.productVariant.currencyCode}
                      className="font-medium"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({order.totalItems} items)</span>
              <Price
                amount={order.totalPrice.toString()}
                currencyCode={
                  order.items[0]?.productVariant.currencyCode || "USD"
                }
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span className="text-muted-foreground">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span className="text-muted-foreground">
                Calculated at checkout
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <Price
                amount={order.totalPrice.toString()}
                currencyCode={
                  order.items[0]?.productVariant.currencyCode || "USD"
                }
                className="text-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Next */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            What's Next?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="font-medium">Payment Processed</h4>
                <p className="text-sm text-muted-foreground">
                  Your payment has been successfully processed and your order is
                  confirmed.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="font-medium">Order Processing</h4>
                <p className="text-sm text-muted-foreground">
                  We're preparing your order for shipment. You'll receive an
                  email with tracking information once it ships.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="font-medium">Shipping Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Track your package and get delivery updates via email and SMS.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any questions about your order, please contact our
            customer support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href="mailto:support@example.com"
              className="text-primary hover:underline text-sm"
            >
              support@example.com
            </a>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <a
              href="tel:1-800-123-4567"
              className="text-primary hover:underline text-sm"
            >
              1-800-123-4567
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
