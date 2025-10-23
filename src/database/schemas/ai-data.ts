import {
  pgTable,
  text,
  jsonb,
  integer,
  uuid,
  varchar,
  index,
  boolean,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { DEFAULT_DATE_TABLES } from "../helpers/dates";
import {
  ProviderMetadata,
  ReasoningOutput,
  Tool,
  TypedToolCall,
  TypedToolResult,
} from "ai";

/**
 * AI data table for storing AI SDK generateText results
 * Used for analysis, debugging, and monitoring AI responses
 */
export const aiData = pgTable(
  "ai_data",
  {
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
    // Context about what this AI call was for
    operationType: varchar("operation_type", { length: 100 }).notNull(),
    operationId: uuid("operation_id"), // Optional link to specific operation

    // Input parameters
    systemPrompt: text("system_prompt"),
    userPrompt: text("user_prompt"),
    modelName: varchar("model_name", { length: 100 }),
    temperature: integer("temperature"), // Stored as integer (multiply by 100 for precision)

    // Generated output
    generatedText: text("generated_text").notNull(),

    // Token usage statistics
    promptTokens: integer("prompt_tokens"),
    completionTokens: integer("completion_tokens"),
    totalTokens: integer("total_tokens"),

    // Additional metadata as JSON
    reasoning: jsonb("reasoning").$type<ReasoningOutput[]>(), // Array of ReasoningOutput
    toolCalls:
      jsonb("tool_calls").$type<TypedToolCall<Record<string, Tool>>[]>(), // Array of TypedToolCall
    toolResults:
      jsonb("tool_results").$type<TypedToolResult<Record<string, Tool>>[]>(), // Array of TypedToolResult
    providerMetadata: jsonb("provider_metadata").$type<ProviderMetadata>(), // ProviderMetadata

    // Processing metadata
    processingTimeMs: integer("processing_time_ms"), // How long the AI call took
    success: boolean("success").notNull().default(true),
    errorMessage: text("error_message"),

    ...DEFAULT_DATE_TABLES,
  },
  (table) => ({
    // Indexes for performance
    operationTypeIndex: index("ai_data_operation_type_index").on(
      table.operationType,
    ),
    operationIdIndex: index("ai_data_operation_id_index").on(table.operationId),
    createdAtIndex: index("ai_data_created_at_index").on(table.createdAt),
    successIndex: index("ai_data_success_index").on(table.success),
  }),
);

// Relations definitions
export const aiDataRelations = relations(aiData, ({}) => ({
  // Add relations here if needed in the future
}));

// Type exports for Drizzle
export type SelectAiData = typeof aiData.$inferSelect;
export type InsertAiData = typeof aiData.$inferInsert;
