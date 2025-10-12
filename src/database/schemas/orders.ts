import { integer, pgTable, uuid, pgEnum, index } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { DEFAULT_DATE_TABLES } from "../helpers/dates";
import { profiles } from "./profiles";
import { productVariants } from "./product-variants";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "completed",
  "cancelled",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    totalPrice: integer("total_price").notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    ...DEFAULT_DATE_TABLES,
  },
  (table) => ({
    userIdIndex: index("orders_user_id_index").on(table.userId),
  })
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productVariantId: uuid("product_variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "no action" }),
    quantity: integer("quantity").notNull(),
    priceAtPurchase: integer("price_at_purchase").notNull(),
    ...DEFAULT_DATE_TABLES,
  },
  (table) => ({
    orderIdIndex: index("order_items_order_id_index").on(table.orderId),
  })
);

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(profiles, {
    fields: [orders.userId],
    references: [profiles.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  productVariant: one(productVariants, {
    fields: [orderItems.productVariantId],
    references: [productVariants.id],
  }),
}));

export type SelectOrder = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type SelectOrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
