import {
  pgTable,
  boolean,
  integer,
  jsonb,
  varchar,
  index,
  real,
  uuid,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { DEFAULT_DATE_TABLES } from "../helpers/dates";
import { products } from "./products";

// Product variants table
export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    availableForSale: boolean("available_for_sale").notNull().default(true),
    selectedOptions: jsonb("selected_options")
      .$type<{ name: string; value: string }[]>()
      .notNull(),
    price: integer("price").notNull(), // Make sure to keep integer format $9.99 -> 999
    currencyCode: varchar("currency_code", { length: 3 }).notNull(),
    inventoryQuantity: integer("inventory_quantity"),
    weight: real("weight"),
    weightUnit: varchar("weight_unit", { length: 10 }),
    ...DEFAULT_DATE_TABLES,
  },
  (table) => ({
    // Indexes for performance
    productIdIndex: index("product_variants_product_id_index").on(
      table.productId
    ),
    availableForSaleIndex: index(
      "product_variants_available_for_sale_index"
    ).on(table.availableForSale),
    inventoryQuantityIndex: index(
      "product_variants_inventory_quantity_index"
    ).on(table.inventoryQuantity),
  })
);

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  })
);

export type SelectProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = typeof productVariants.$inferInsert;
