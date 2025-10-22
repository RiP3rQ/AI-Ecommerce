import { z } from "zod";

/**
 * Custom UUID schema that accepts any valid UUID format, not just RFC 4122 compliant ones.
 * PostgreSQL accepts UUIDs that aren't strictly RFC 4122 compliant.
 */
export const uuidSchema = z.string().regex(
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  "Invalid UUID format"
);

/**
 * Schema for getting a single product by UUID.
 */
export const getProductSchema = z.object({
  id: uuidSchema,
});

export type GetProductDto = z.infer<typeof getProductSchema>;
