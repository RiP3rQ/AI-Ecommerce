import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { DEFAULT_DATE_TABLES } from "../helpers/dates";
import { sql } from "drizzle-orm";

/**
 * Profiles table linked to Supabase auth.users.
 * This table stores application-specific user data.
 */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // References auth.users.id
  email: text("email").notNull().default(""),
  acceptedDataPolicy: boolean("accepted_data_policy").notNull().default(true),
  aiUsageCount: integer("ai_usage_count").notNull().default(0),
  aiUsageLimit: integer("ai_usage_limit").notNull().default(30),
  aiUsageResetAt: timestamp("ai_usage_reset_at").notNull().defaultNow(),
  ...DEFAULT_DATE_TABLES,
});

export type SelectProfile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
