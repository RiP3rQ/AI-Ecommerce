import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { DEFAULT_DATE_TABLES } from "../helpers/dates";
import { products } from "./products";

export const categories = pgTable("categories", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  ...DEFAULT_DATE_TABLES,
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export type SelectCategory = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
