# Database Documentation

This document provides comprehensive information about the database architecture and schemas used in the AI E-commerce application.

## Overview

The application uses **PostgreSQL** as the database with **Drizzle ORM** for type-safe database operations. The database is designed to support an e-commerce platform with products, variants, images, and navigation menus.

## Architecture

### Tech Stack
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM v0.44.6
- **Migration Tool**: Drizzle Kit v0.31.5
- **Authentication**: Supabase Auth
- **Environment Management**: T3 Env with Zod validation

### Database Connection
The database connection is established through environment variables defined in `src/env.ts`:

```typescript
DATABASE_URL: z.string().url(), // PostgreSQL connection string
```

### Database Client
Located in `src/database/index.ts`, the client is configured with:
- Connection pooling via `postgres-js`
- Disabled prefetch for transaction mode compatibility
- Drizzle ORM wrapper for type-safe queries

## Schema Structure

### Core Tables

#### 1. Menu Items (`menu_items`)
Simple navigation menu structure for the application.

**Schema**:
```sql
CREATE TABLE "menu_items" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "path" text NOT NULL
);
```

**Fields**:
- `id`: Auto-incrementing primary key
- `title`: Display text for the menu item
- `path`: URL path for navigation

#### 2. Products (`products`)
Main product catalog table containing core product information.

**Schema**:
```sql
CREATE TABLE "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "url_handle" varchar(255) UNIQUE NOT NULL,
  "available_for_sale" boolean DEFAULT true NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" text,
  "description_html" text,
  "tags" jsonb DEFAULT '[]'::jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
```

**Fields**:
- `id`: UUID primary key with auto-generation
- `url_handle`: Unique URL-friendly identifier for the product
- `available_for_sale`: Boolean flag for product availability
- `title`: Product name (max 255 chars)
- `description`: Plain text product description
- `description_html`: HTML-formatted product description
- `tags`: JSON array of product tags
- `created_at`/`updated_at`: Automatic timestamp tracking

**Indexes**:
- `available_for_sale_index` - For filtering available products
- `title_index` - For product search
- `created_at_index`/`updated_at_index` - For sorting and filtering

#### 3. Product Variants (`product_variants`)
Handles different variations of products (e.g., different sizes, colors, materials).

**Schema**:
```sql
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
```

**Fields**:
- `product_id`: Foreign key to products table (CASCADE delete)
- `title`: Variant-specific title
- `selected_options`: JSON array of selected option combinations
- `price`: Price in smallest currency unit (e.g., cents for USD)
- `currency_code`: ISO 4217 currency code (3 chars)
- `inventory_quantity`: Stock level (nullable for unlimited stock)
- `weight`/`weight_unit`: Product weight for shipping calculations

**Indexes**:
- `product_id_index` - For querying variants by product
- `available_for_sale_index` - For filtering available variants
- `inventory_quantity_index` - For inventory management

#### 4. Product Images (`product_images`)
Stores product image information with ordering support.

**Schema**:
```sql
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
```

**Fields**:
- `product_id`: Foreign key to products table (CASCADE delete)
- `url`: Image URL or file path
- `alt_text`: Alt text for accessibility
- `order`: Display order for images
- `width`/`height`: Image dimensions for optimization

**Indexes**:
- `product_id_index` - For querying images by product
- `order_index` - For ordered image retrieval

#### 5. Product Options (`product_options`)
Defines configurable product options (e.g., Size: [S, M, L], Color: [Red, Blue]).

**Schema**:
```sql
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
```

**Fields**:
- `product_id`: Foreign key to products table (CASCADE delete)
- `name`: Option name (e.g., "Size", "Color")
- `position`: Display order for options
- `values`: JSON array of available values for this option

**Constraints**:
- Unique constraint on `(product_id, name)` - prevents duplicate option names per product

**Indexes**:
- `product_id_index` - For querying options by product
- `position_index` - For ordered option retrieval

## Relationships

### Entity Relationship Diagram

```
products (1) ──── (many) product_variants
  │
  ├── (many) product_images
  │
  └── (many) product_options
```

- **Products → Variants**: One-to-many, CASCADE delete
- **Products → Images**: One-to-many, CASCADE delete
- **Products → Options**: One-to-many, CASCADE delete

All child tables have CASCADE delete relationships, ensuring data consistency when products are removed.

## Type Safety

Drizzle ORM provides full TypeScript integration:

```typescript
// Inferred types from schema definitions
export type SelectProduct = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Relations for joined queries
export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
  images: many(productImages),
  options: many(productOptions),
}));
```

## Database Helpers

### Date Fields (`src/database/helpers/dates.ts`)
All tables use standardized timestamp fields:

```typescript
export const DEFAULT_DATE_TABLES = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`now()`),
} as const;
```

- `created_at`: Set on insert, never updated
- `updated_at`: Set on insert and auto-updated on row modifications

## Migrations

Database schema changes are managed through Drizzle migrations:

### Migration Files
- `0000_busy_proudstar.sql`: Initial menu_items table
- `0001_chief_ma_gnuci.sql`: Complete product catalog schema

### Running Migrations
```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit push

# Check migration status
npx drizzle-kit check
```

## Authentication Integration

While the database schemas focus on product data, user authentication is handled through **Supabase Auth**:

- **Client-side**: `src/supabase-auth/client.ts` - Browser Supabase client
- **Server-side**: `src/supabase-auth/server.ts` - Server Supabase client
- **Middleware**: `src/supabase-auth/middleware.ts` - Session management

## Query Patterns

### Common Operations

#### Get Product with Variants and Images
```typescript
const productWithRelations = await db
  .select()
  .from(products)
  .where(eq(products.id, productId))
  .leftJoin(productVariants, eq(products.id, productVariants.productId))
  .leftJoin(productImages, eq(products.id, productImages.productId))
  .leftJoin(productOptions, eq(products.id, productOptions.productId));
```

#### Insert Product with Relations
```typescript
// Insert main product
const [product] = await db.insert(products).values(productData).returning();

// Insert related data
await db.insert(productVariants).values(variantsData);
await db.insert(productImages).values(imagesData);
await db.insert(productOptions).values(optionsData);
```

## Performance Considerations

### Indexes
- Strategic indexes on frequently queried fields
- Composite indexes for multi-column queries
- Foreign key indexes for join performance

### Data Types
- UUID for primary keys (better distribution than serial)
- JSONB for flexible data (tags, options, selected_options)
- Appropriate VARCHAR lengths to save space
- INTEGER for prices (avoids floating point precision issues)

### Constraints
- Unique constraints prevent data duplication
- Foreign key constraints maintain referential integrity
- NOT NULL constraints ensure data completeness

## Development Workflow

### Schema Changes
1. Modify schema files in `src/database/schemas/`
2. Run `npx drizzle-kit generate` to create migrations
3. Review and apply migrations
4. Update TypeScript types automatically through Drizzle

### Environment Setup
Ensure `.env.local` contains:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

## Best Practices

### Data Integrity
- Always use transactions for multi-table operations
- Validate data at application level before database insertion
- Use CASCADE deletes judiciously

### Performance
- Use appropriate indexes for query patterns
- Consider pagination for large result sets
- Monitor query performance with EXPLAIN

### Type Safety
- Leverage Drizzle's type inference for full TypeScript support
- Use the provided type exports for API responses
- Keep schema definitions in sync with migrations

## Troubleshooting

### Common Issues
- **Connection errors**: Verify DATABASE_URL format and credentials
- **Migration conflicts**: Check migration status with `drizzle-kit check`
- **Type errors**: Regenerate types after schema changes

### Debugging
- Enable query logging in development
- Use Drizzle's query builder for complex operations
- Check PostgreSQL logs for detailed error information
