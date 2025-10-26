import z from "zod";

// ============================= PAGINATION URL SCHEMA =============================
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 12,
};
export const paginationUrlSchema = z.object({
  page: z.number().optional().default(DEFAULT_PAGINATION.page),
  limit: z.number().optional().default(DEFAULT_PAGINATION.limit),
});
export type PaginationUrlSchema = z.infer<typeof paginationUrlSchema>;

// ============================= SHOP URL SCHEMA =============================
export const DEFAULT_SHOP_FILTERS = {
  sortDirection: "asc" as const,
  sortField: "createdAt",
  search: "",
  categoryId: "",
  priceRange: { min: 0, max: 100000 }, // 1,000 dollars in cents
};

export const shopFiltersUrlSchema = z.object({
  sortDirection: z
    .enum(["asc", "desc"])
    .optional()
    .default(DEFAULT_SHOP_FILTERS.sortDirection),
  sortField: z.string().optional().default(DEFAULT_SHOP_FILTERS.sortField),
  search: z.string().optional().default(DEFAULT_SHOP_FILTERS.search),
  categoryId: z.string().optional().default(DEFAULT_SHOP_FILTERS.categoryId),
  priceRange: z
    .object({
      min: z.number().optional().default(DEFAULT_SHOP_FILTERS.priceRange.min),
      max: z.number().optional().default(DEFAULT_SHOP_FILTERS.priceRange.max),
    })
    .optional()
    .default(DEFAULT_SHOP_FILTERS.priceRange),
});
export type ShopFiltersUrlSchema = z.infer<typeof shopFiltersUrlSchema>;
