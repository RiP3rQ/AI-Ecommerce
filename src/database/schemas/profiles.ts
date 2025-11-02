import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { DEFAULT_DATE_TABLES } from "../helpers/dates";

/**
 * Profiles table linked to Supabase auth.users.
 * This table stores application-specific user data.
 */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // References auth.users.id
  email: text("email").notNull().default(""),
  acceptedDataPolicy: boolean("accepted_data_policy").notNull().default(false),
  ...DEFAULT_DATE_TABLES,
});

export type SelectProfile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
