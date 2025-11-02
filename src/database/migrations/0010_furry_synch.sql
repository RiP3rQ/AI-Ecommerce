ALTER TABLE "profiles" ALTER COLUMN "accepted_data_policy" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "ai_usage_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "ai_usage_limit" integer DEFAULT 20 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "ai_usage_reset_at" timestamp DEFAULT now() NOT NULL;