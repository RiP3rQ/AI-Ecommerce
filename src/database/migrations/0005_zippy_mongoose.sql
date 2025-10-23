CREATE TABLE "ai_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"operation_type" varchar(100) NOT NULL,
	"operation_id" uuid,
	"system_prompt" text,
	"user_prompt" text,
	"model_name" varchar(100),
	"temperature" integer,
	"generated_text" text NOT NULL,
	"prompt_tokens" integer,
	"completion_tokens" integer,
	"total_tokens" integer,
	"reasoning" jsonb,
	"tool_calls" jsonb,
	"tool_results" jsonb,
	"provider_metadata" jsonb,
	"processing_time_ms" integer,
	"success" boolean DEFAULT true NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "ai_data_operation_type_index" ON "ai_data" USING btree ("operation_type");--> statement-breakpoint
CREATE INDEX "ai_data_operation_id_index" ON "ai_data" USING btree ("operation_id");--> statement-breakpoint
CREATE INDEX "ai_data_created_at_index" ON "ai_data" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "ai_data_success_index" ON "ai_data" USING btree ("success");