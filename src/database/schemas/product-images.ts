import { pgTable, text, integer, index, uuid } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { DEFAULT_DATE_TABLES } from "../helpers/dates";
import { products } from "./products";

// Product images table
export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    altText: text("alt_text"),
    order: integer("order").notNull().default(0),
    width: integer("width"),
    height: integer("height"),
    ...DEFAULT_DATE_TABLES,
  },
  (table) => ({
    // Indexes for performance
    productIdIndex: index("product_images_product_id_index").on(
      table.productId
    ),
    orderIndex: index("product_images_order_index").on(
      table.productId,
      table.order
    ),
  })
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export type SelectProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = typeof productImages.$inferInsert;
