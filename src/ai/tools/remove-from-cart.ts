import { tool, zodSchema } from "ai";
import z from "zod";
import { removeFromCart } from "../tool-helpers/cart-tools";
import { uuidSchema } from "@/app/api/product/[id]/dto";

export const removeFromCartTool = tool({
  description:
    "Remove items from the user's shopping cart. Requires user approval before execution. This tool will find and remove cart items matching the specified product IDs and quantities.",
  inputSchema: zodSchema(
    z.object({
      userId: z
        .string()
        .optional()
        .describe(
          "(Optional) The user's ID. If not provided, it will be provided by the experimental_context.",
        ),
      productIds: z
        .array(uuidSchema)
        .min(1, "At least one product ID is required"),
      quantities: z
        .array(z.number().int().min(1, "Quantity must be at least 1"))
        .min(1, "At least one quantity is required"),
    }),
  ),
  needsApproval: true, // Required for client-side approval functionality
  execute: async (args, options) => {
    const { userId, productIds, quantities } = args;

    const userIdFromContext =
      (options.experimental_context as { userId: string })?.userId ?? userId;

    if (!userIdFromContext) {
      return {
        cart: null,
        found: false,
        message: "No user ID provided",
      };
    }

    return await removeFromCart(userIdFromContext, productIds, quantities);
  },
});
