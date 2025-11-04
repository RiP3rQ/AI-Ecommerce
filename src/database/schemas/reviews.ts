import {
  numeric,
  pgTable,
  text,
  uuid,
  pgEnum,
  index,
  vector,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { DEFAULT_DATE_TABLES } from "../helpers/dates";
import { products } from "./products";
import { profiles } from "./profiles";

export const feedbackEnum = pgEnum("feedback_type", ["like", "dislike"]);

export const embeddingStatusEnum = pgEnum("embedding_status", [
  "pending",
  "generated",
  "failed",
]);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    rating: numeric("rating", { precision: 3, scale: 1 }).notNull(), // Supports half-star ratings (e.g., 4.5)
    content: text("content").notNull(),
    embeddingStatus: embeddingStatusEnum("embedding_status").default("pending"),
    embedding: vector("embedding", { dimensions: 1536 }), // For AI summarization
    ...DEFAULT_DATE_TABLES,
  },
  (table) => ({
    productIdIndex: index("reviews_product_id_index").on(table.productId),
    userIdIndex: index("reviews_user_id_index").on(table.userId),
    // productUserUniqueIndex: uniqueIndex("reviews_product_user_unique_index").on(table.productId, table.userId), // Should be unique, but we don't want to enforce it for now. (for testing purposes we used the same user_id for most of the reviews)
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

export const reviewSummaries = pgTable(
  "review_summaries",
  {
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" })
      .unique(),
    summary: text("summary").notNull(),
    ...DEFAULT_DATE_TABLES,
  },
  (table) => ({
    productIdIndex: index("review_summaries_product_id_index").on(
      table.productId,
    ),
  }),
);

export const reviewSummaryFeedback = pgTable(
  "review_summary_feedback",
  {
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
    summaryId: uuid("summary_id")
      .notNull()
      .references(() => reviewSummaries.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    feedback: feedbackEnum("feedback").notNull(),
    ...DEFAULT_DATE_TABLES,
  },
  (table) => ({
    summaryIdIndex: index("review_summary_feedback_summary_id_index").on(
      table.summaryId,
    ),
    userIdIndex: index("review_summary_feedback_user_id_index").on(
      table.userId,
    ),
  }),
);

// Relations
export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(profiles, {
    fields: [reviews.userId],
    references: [profiles.id],
  }),
}));

export const reviewSummariesRelations = relations(
  reviewSummaries,
  ({ one, many }) => ({
    product: one(products, {
      fields: [reviewSummaries.productId],
      references: [products.id],
    }),
    feedbacks: many(reviewSummaryFeedback),
  }),
);

export const reviewSummaryFeedbackRelations = relations(
  reviewSummaryFeedback,
  ({ one }) => ({
    summary: one(reviewSummaries, {
      fields: [reviewSummaryFeedback.summaryId],
      references: [reviewSummaries.id],
    }),
    user: one(profiles, {
      fields: [reviewSummaryFeedback.userId],
      references: [profiles.id],
    }),
  }),
);

export type SelectReview = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
export type SelectReviewSummary = typeof reviewSummaries.$inferSelect;
export type InsertReviewSummary = typeof reviewSummaries.$inferInsert;
export type SelectReviewSummaryFeedback =
  typeof reviewSummaryFeedback.$inferSelect;
export type InsertReviewSummaryFeedback =
  typeof reviewSummaryFeedback.$inferInsert;
