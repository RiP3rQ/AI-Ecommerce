import { ReactNode } from "react";
import { CartItemList } from "@/components/checkout/cart-item-list";
import { OrderSummary } from "@/components/checkout/order-summary";
import { SuggestedProducts } from "@/components/checkout/suggested-products";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/**
 * Checkout page component that displays cart items and suggested products.
 * Uses a two-column layout: left column for cart and order summary,
 * right column for suggested products.
 */
export default function CheckoutPage(): ReactNode {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          Review your items and complete your purchase.
        </p>
      </div>

      {/* Main Checkout Layout */}
      <div className="space-y-8">
        {/* Cart Items */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          <CartItemList />
        </div>

        <Separator />

        {/* Suggested Products */}
        <SuggestedProducts />

        <Separator />

        {/* Order Summary */}
        <OrderSummary />

        {/* Checkout Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1" size="lg">
            Complete Purchase
          </Button>
          <Button variant="outline" className="flex-1" size="lg">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
