import {
  pgTable,
  text,
  boolean,
  jsonb,
  varchar,
  index,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { DEFAULT_DATE_TABLES } from "../helpers/dates";
import { productVariants } from "./product-variants";
import { productImages } from "./product-images";
import { productOptions } from "./product-options";
import { categories } from "./categories";

// Main products table
export const products = pgTable(
  "products",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    availableForSale: boolean("available_for_sale").notNull().default(true),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    descriptionHtml: text("description_html"),
    tags: jsonb("tags").$type<string[]>().default([]), // Store tags as JSON array
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    embedding: vector("embedding", { dimensions: 1536 }), // Example dimension for OpenAI embeddings
    ...DEFAULT_DATE_TABLES,
  },
  (table) => ({
    // Indexes for performance
    availableForSaleIndex: index("products_available_for_sale_index").on(
      table.availableForSale
    ),
    titleIndex: index("products_title_index").on(table.title),
    createdAtIndex: index("products_created_at_index").on(table.createdAt),
    updatedAtIndex: index("products_updated_at_index").on(table.updatedAt),
    categoryIdIndex: index("products_category_id_index").on(table.categoryId),
  })
);

// Relations definitions for Drizzle ORM
export const productsRelations = relations(products, ({ one, many }) => ({
  variants: many(productVariants),
  images: many(productImages),
  options: many(productOptions),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

// Type exports for Drizzle
export type SelectProduct = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
