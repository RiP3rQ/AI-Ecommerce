import { z } from "zod";

/**
 * Schema for getting a single product by UUID.
 */
export const getProductSchema = z.object({
  id: z.uuid("Invalid product UUID format"),
});

export type GetProductDto = z.infer<typeof getProductSchema>;
