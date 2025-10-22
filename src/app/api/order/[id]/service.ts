import { DrizzleDbClient, drizzleDbClient } from "@/database/index";
import { orders, orderItems } from "@/database/schemas/orders";
import { eq } from "drizzle-orm";
import { OrderNotFoundError } from "@/lib/errors";
import type { TestDatabase } from "@/test/utils/db-helper";
import type { OrderDetails } from "./dto";
import { SelectProductImage } from "@/database/schema";

/**
 * Service class for order operations.
 * Handles the business logic for retrieving order details.
 */
export class OrderService {
  /**
   * Retrieves complete order details by order ID.
   * Includes all order items with full product and variant information.
   * @param orderId - The order ID to fetch
   * @param userId - The user ID (for authorization)
   * @param db - Optional database connection (for testing)
   * @returns Complete order details
   */
  public async getOrderDetails({
    orderId,
    userId,
    db,
  }: Readonly<{
    orderId: string;
    userId: string;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<OrderDetails> {
    // Fetch order with all related data
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        items: {
          with: {
            productVariant: {
              with: {
                product: {
                  with: {
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new OrderNotFoundError();
    }

    // Verify order belongs to the requesting user
    if (order.userId !== userId) {
      throw new OrderNotFoundError();
    }

    // Add featured image to each order item
    const orderWithFeaturedImages = {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        featuredImage: this.getFeaturedImage(
          item.productVariant.product.images,
        ),
      })),
    };

    // Calculate total items
    const totalItems = orderWithFeaturedImages.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    return {
      id: orderWithFeaturedImages.id,
      totalPrice: orderWithFeaturedImages.totalPrice,
      status: orderWithFeaturedImages.status,
      createdAt: orderWithFeaturedImages.createdAt,
      updatedAt: orderWithFeaturedImages.updatedAt,
      items: orderWithFeaturedImages.items,
      totalItems,
    };
  }

  /**
   * Gets the featured image for a product (lowest order value).
   * @param images - Array of product images
   * @returns Featured image or null if no images
   */
  private getFeaturedImage(
    images: SelectProductImage[],
  ): SelectProductImage | null {
    if (images.length === 0) {
      return null;
    }

    // Find image with lowest order value
    return images.reduce((featured, current) =>
      current.order < featured.order ? current : featured,
    );
  }
}

export const orderService = new OrderService();
