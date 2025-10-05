import {
  pgTable,
  integer,
  jsonb,
  varchar,
  index,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { DEFAULT_DATE_TABLES } from "../helpers/dates";
import { products } from "./products";

// Product options table
export const productOptions = pgTable(
  "product_options",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    position: integer("position").notNull().default(0),
    values: jsonb("values").$type<string[]>().notNull(),
    ...DEFAULT_DATE_TABLES,
  },
  (table) => ({
    // Unique constraints
    productIdNameUnique: unique("product_options_product_id_name_unique").on(
      table.productId,
      table.name
    ),
    // Indexes for performance
    productIdIndex: index("product_options_product_id_index").on(
      table.productId
    ),
    positionIndex: index("product_options_position_index").on(
      table.productId,
      table.position
    ),
  })
);

export const productOptionsRelations = relations(productOptions, ({ one }) => ({
  product: one(products, {
    fields: [productOptions.productId],
    references: [products.id],
  }),
}));

export type SelectProductOption = typeof productOptions.$inferSelect;
export type InsertProductOption = typeof productOptions.$inferInsert;
