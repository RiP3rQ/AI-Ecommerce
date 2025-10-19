import { z } from "zod";

/**
 * Schema for shop product filtering and sorting query parameters.
 */
export const getProductsSchema = z.object({
  // Pagination
  page: z
    .number()
    .int()
    .min(1, "Page must be at least 1.")
    .optional()
    .default(1),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1.")
    .max(100, "Limit cannot exceed 100.")
    .optional()
    .default(10),

  // Sorting
  sortDirection: z.enum(["asc", "desc"]).optional().default("asc"),
  sortField: z
    .enum(["createdAt", "updatedAt", "title", "price", "availableForSale"])
    .optional()
    .default("createdAt"),

  // Filtering
  search: z.string().optional(),
  categoryId: z.string().uuid("Category ID must be a valid UUID.").optional(),
  priceMin: z
    .number()
    .int()
    .min(0, "Minimum price must be at least 0.")
    .optional(),
  priceMax: z
    .number()
    .int()
    .min(0, "Maximum price must be at least 0.")
    .optional(),
  availableForSale: z.boolean().optional(),
});

export type GetProductsDto = z.infer<typeof getProductsSchema>;

/**
 * Refine schema to validate price range logic.
 */
export const getProductsSchemaRefined = getProductsSchema.refine(
  (data) => {
    if (data.priceMin !== undefined && data.priceMax !== undefined) {
      return data.priceMin <= data.priceMax;
    }
    return true;
  },
  {
    message: "Minimum price must be less than or equal to maximum price.",
    path: ["priceMin"],
  },
);
