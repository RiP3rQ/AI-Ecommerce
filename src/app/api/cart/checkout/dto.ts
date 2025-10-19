import { z } from "zod";

/**
 * Response schema for successful checkout completion.
 */
export const checkoutResponseSchema = z.object({
  success: z.boolean(),
  orderId: z.uuid().describe("The ID of the order created."),
  totalItems: z
    .number()
    .int()
    .min(0)
    .describe("The total number of items in the order."),
  totalPrice: z
    .number()
    .int()
    .min(0)
    .describe("The total price of the order in cents."),
  currencyCode: z.string().describe("The currency code of the order."),
  message: z.string().describe("The message to be displayed to the user."),
});

export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>;
