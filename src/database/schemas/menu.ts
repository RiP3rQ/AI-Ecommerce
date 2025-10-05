import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  path: text("path").notNull(),
});

export type SelectMenuItemType = typeof menuItems.$inferSelect;
export type InsertMenuItemType = typeof menuItems.$inferInsert;
