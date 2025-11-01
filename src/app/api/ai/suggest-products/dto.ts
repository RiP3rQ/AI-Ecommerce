import z from "zod";

/**
 * Schema for individual product suggestions.
 * Used for validation when AI returns structured JSON responses.
 */
export const productSuggestionSchema = z.object({
  productId: z.string().uuid("Product ID must be a valid UUID").describe("The ID of the product to suggest"),
  reason: z.string().min(1, "Reason cannot be empty").describe("The reason for the suggestion"),
});

/**
 * Schema for the complete suggestions response.
 * Used for validation when AI returns structured JSON responses.
 */
export const suggestProductsResponseSchema = z.array(productSuggestionSchema).describe("A list of product suggestions");

/**
 * Type for individual product suggestion.
 */
export type ProductSuggestionDto = z.infer<typeof productSuggestionSchema>;