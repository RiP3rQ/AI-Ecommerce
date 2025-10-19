import { DrizzleDbClient, drizzleDbClient } from "@/database/index";
import { orders, orderItems } from "@/database/schemas/orders";
import { cartService } from "../service";
import { EmptyCartError } from "@/lib/errors";
import type { CartSummary } from "../types";
import type { TestDatabase } from "@/test/utils/db-helper";

/**
 * Service class for checkout operations.
 * Handles the business logic for completing purchases and order creation.
 */
export class CheckoutService {
  /**
   * Completes the checkout process for a user.
   * Creates an order from the current cart contents and clears the cart.
   * @param userId - The user's ID
   * @param db - Optional database connection (for testing)
   * @returns Order completion details
   */
  public async completeCheckout({
    userId,
    db,
  }: Readonly<{
    userId: string;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<{
    orderId: string;
    totalItems: number;
    totalPrice: number;
    currencyCode: string;
  }> {
    // Get the current cart
    const cartSummary = await cartService.getCart({ userId, db });

    // Validate cart is not empty
    if (cartSummary.totalItems === 0) {
      throw new EmptyCartError();
    }

    // Create order and order items in a transaction
    const result = await db.transaction(async (tx) => {
      // Create the order
      const [newOrder] = await tx
        .insert(orders)
        .values({
          userId,
          totalPrice: cartSummary.totalPrice,
          status: "completed", // MVP: immediately mark as completed
        })
        .returning();

      if (!newOrder) {
        throw new Error("Failed to create order");
      }

      // Create order items from cart items
      const orderItemsData = cartSummary.cart.items.map((item) => ({
        orderId: newOrder.id,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        priceAtPurchase: item.productVariant.price,
      }));

      await tx.insert(orderItems).values(orderItemsData);

      // Clear the cart
      await cartService.clearCart({ userId, db: tx as DrizzleDbClient | TestDatabase });

      return {
        orderId: newOrder.id,
        totalItems: cartSummary.totalItems,
        totalPrice: cartSummary.totalPrice,
        currencyCode: cartSummary.currencyCode,
      };
    });

    return result;
  }
}

export const checkoutService = new CheckoutService();
