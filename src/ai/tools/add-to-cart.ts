import { tool, zodSchema } from "ai";
import z from "zod";
import { uuidSchema } from "@/app/api/product/[id]/dto";

export const addToCartTool = tool({
  description:
    "Add a product to the user's cart. Shows a modal for size/color selection when needed.",
  inputSchema: zodSchema(
    z.object({
      productId: uuidSchema,
      productTitle: z.string().min(1, "Product title cannot be empty"),
      quantity: z.number().min(1).max(10).default(1),
    }),
  ),
});
