CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"available_for_sale" boolean DEFAULT true NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"description_html" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"available_for_sale" boolean DEFAULT true NOT NULL,
	"selected_options" jsonb NOT NULL,
	"price" integer NOT NULL,
	"currency_code" varchar(3) NOT NULL,
	"inventory_quantity" integer,
	"weight" real,
	"weight_unit" varchar(10),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"order" integer DEFAULT 0 NOT NULL,
	"width" integer,
	"height" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"values" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_options_product_id_name_unique" UNIQUE("product_id","name")
);
--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "products_available_for_sale_index" ON "products" USING btree ("available_for_sale");--> statement-breakpoint
CREATE INDEX "products_title_index" ON "products" USING btree ("title");--> statement-breakpoint
CREATE INDEX "products_created_at_index" ON "products" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "products_updated_at_index" ON "products" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "product_variants_product_id_index" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_variants_available_for_sale_index" ON "product_variants" USING btree ("available_for_sale");--> statement-breakpoint
CREATE INDEX "product_variants_inventory_quantity_index" ON "product_variants" USING btree ("inventory_quantity");--> statement-breakpoint
CREATE INDEX "product_images_product_id_index" ON "product_images" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_images_order_index" ON "product_images" USING btree ("product_id","order");--> statement-breakpoint
CREATE INDEX "product_options_product_id_index" ON "product_options" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_options_position_index" ON "product_options" USING btree ("product_id","position");