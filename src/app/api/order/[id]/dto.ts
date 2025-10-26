import { z } from "zod";
import { uuidSchema } from "../../product/[id]/dto";

/**
 * Order item with full product details schema for API responses.
 */
export const orderItemWithDetailsSchema = z.object({
  id: uuidSchema,
  quantity: z.number().int().min(1),
  priceAtPurchase: z.number().int().min(0),
  productVariant: z.object({
    id: uuidSchema,
    title: z.string(),
    price: z.number().int().min(0),
    currencyCode: z.string(),
    selectedOptions: z.array(
      z.object({
        name: z.string(),
        value: z.string(),
      }),
    ),
    product: z.object({
      id: uuidSchema,
      title: z.string(),
      description: z.string().nullable(),
      tags: z.array(z.string()).nullable(),
    }),
  }),
  featuredImage: z
    .object({
      id: uuidSchema,
      url: z.string(),
      altText: z.string().nullable(),
      width: z.number().int().nullable(),
      height: z.number().int().nullable(),
    })
    .nullable(),
});

/**
 * Complete order details schema for API responses.
 */
export const orderDetailsSchema = z.object({
  id: uuidSchema,
  totalPrice: z.number().int().min(0),
  status: z.enum(["pending", "completed", "cancelled"]),
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(orderItemWithDetailsSchema),
  totalItems: z.number().int().min(0),
});

/**
 * Response schema for successful order details fetch.
 */
export const orderDetailsResponseSchema = z.object({
  success: z.boolean(),
  data: orderDetailsSchema,
});

export type OrderItemWithDetails = z.infer<typeof orderItemWithDetailsSchema>;
export type OrderDetails = z.infer<typeof orderDetailsSchema>;
export type OrderDetailsResponse = z.infer<typeof orderDetailsResponseSchema>;
