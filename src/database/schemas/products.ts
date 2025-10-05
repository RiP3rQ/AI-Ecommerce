import {
  pgTable,
  text,
  boolean,
  jsonb,
  varchar,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { DEFAULT_DATE_TABLES } from "../helpers/dates";
import { productVariants } from "./product-variants";
import { productImages } from "./product-images";
import { productOptions } from "./product-options";

// Main products table
export const products = pgTable(
  "products",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    urlHandle: varchar("url_handle", { length: 255 }).notNull().unique(),
    availableForSale: boolean("available_for_sale").notNull().default(true),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    descriptionHtml: text("description_html"),
    tags: jsonb("tags").$type<string[]>().default([]), // Store tags as JSON array
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
  })
);

// Relations definitions for Drizzle ORM
export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
  images: many(productImages),
  options: many(productOptions),
}));

// Type exports for Drizzle
export type SelectProduct = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
