import { integer, pgTable, uuid, index } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { DEFAULT_DATE_TABLES } from "../helpers/dates";
import { profiles } from "./profiles";
import { productVariants } from "./product-variants";

export const carts = pgTable(
  "carts",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" })
      .unique(),
    ...DEFAULT_DATE_TABLES,
  },
  (table) => ({
    userIdIndex: index("carts_user_id_index").on(table.userId),
  })
);

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productVariantId: uuid("product_variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    ...DEFAULT_DATE_TABLES,
  },
  (table) => ({
    cartIdIndex: index("cart_items_cart_id_index").on(table.cartId),
    productVariantIdIndex: index("cart_items_product_variant_id_index").on(
      table.productVariantId
    ),
  })
);

// Relations
export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(profiles, {
    fields: [carts.userId],
    references: [profiles.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  productVariant: one(productVariants, {
    fields: [cartItems.productVariantId],
    references: [productVariants.id],
  }),
}));

export type SelectCart = typeof carts.$inferSelect;
export type InsertCart = typeof carts.$inferInsert;
export type SelectCartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;
