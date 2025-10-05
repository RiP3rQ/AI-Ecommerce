import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export const DEFAULT_DATE_TABLES = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`now()`),
} as const;
