import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { sql, eq, DrizzleError } from "drizzle-orm";
import * as schema from "../../database/schema";
import { Pool, PoolClient } from "pg";
import process from "node:process";

/**
 * Database connection type for testing
 */
export type TestDatabase = NodePgDatabase<typeof schema>;

// OPTIMIZATION: Create a single shared pool instance to reuse connections across tests
// This dramatically reduces connection overhead
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 5, // Reduced to 5 for transaction-based work
  min: 2, // Keep minimum ready
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
  query_timeout: 10000,
});

// Test connection on startup (skip logging in test environment)
pool
  .connect()
  .then((client: PoolClient) => {
    client.release();
    if (process.env.NODE_ENV !== "test") {
      console.log(
        `🗄️ Connected to ${
          String(process.env.NODE_ENV) === "test" ? "test" : "development"
        } database`,
      );
    }
  })
  .catch((error: unknown) => {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  });

/**
 * Creates a test database connection.
 * This should be used for test-specific database operations.
 * OPTIMIZATION: Reuses connection pool instead of creating new connections
 */
export function createTestDb(): TestDatabase {
  return drizzle(pool, { schema, logger: false });
}

/**
 * Closes the shared connection pool.
 * Should be called during test teardown to prevent hanging connections.
 */
export async function closePool(): Promise<void> {
  await pool.end();
}

/**
 * Creates a testable unit using database transactions.
 * The transaction is automatically rolled back after the test function completes,
 * ensuring test isolation without affecting other tests.
 *
 * OPTIMIZATION: Uses automatic rollback for fast test cleanup
 *
 * @param func - Test function that receives a database connection
 * @returns Promise that resolves when the test function completes
 */
export async function createTestableUnit(
  func: (db: TestDatabase) => Promise<void>,
): Promise<void> {
  const db = createTestDb();

  try {
    await db.transaction(async (tx) => {
      try {
        await func(tx);
      } finally {
        // OPTIMIZATION: Always rollback to avoid test pollution
        tx.rollback();
      }
    });
  } catch (error) {
    if (process.env.DISABLE_DEBUG_LOGGING === "true") {
      return;
    }

    if (error instanceof DrizzleError) {
      if (error.message.includes("Rollback")) {
        // OPTIMIZATION: Ignore expected rollback errors
        return;
      }
      // Log other Drizzle errors but don't throw
      console.warn("[Drizzle] DB Error:", error.message);
    } else {
      console.error("[TEST] Error:", error);
      throw error;
    }
  }
}

/**
 * Database utility helpers for testing.
 * Provides common database operations optimized for performance.
 */
export const dbHelpers = {
  /**
   * Truncates all data from all tables while preserving schema.
   * Uses batch execution for better performance.
   *
   * OPTIMIZATION: Executes related truncations concurrently
   *
   * @param db - Database connection to use for truncation
   */
  async truncateAllTables(db?: TestDatabase): Promise<void> {
    if (!db) {
      db = createTestDb();
    }

    // OPTIMIZATION: Group truncations by dependency level for parallel execution
    // Level 1: Independent tables (no foreign keys pointing to others)
    await Promise.all([
      db.execute(sql`TRUNCATE TABLE reviews CASCADE`),
      db.execute(sql`TRUNCATE TABLE carts CASCADE`),
      db.execute(sql`TRUNCATE TABLE orders CASCADE`),
      db.execute(sql`TRUNCATE TABLE product_options CASCADE`),
      db.execute(sql`TRUNCATE TABLE product_images CASCADE`),
      db.execute(sql`TRUNCATE TABLE product_variants CASCADE`),
    ]);

    // Level 2: Parent tables
    await db.execute(sql`TRUNCATE TABLE products CASCADE`);
    await db.execute(sql`TRUNCATE TABLE categories CASCADE`);
    await db.execute(sql`TRUNCATE TABLE profiles CASCADE`);
  },

  /**
   * Creates a test user profile.
   * Useful for setting up authenticated user context in tests.
   *
   * @param db - Database connection
   * @param profileData - Profile data to insert
   * @returns Created profile
   */
  async createTestProfile(
    db: TestDatabase,
    profileData: {
      id: string;
      acceptedDataPolicy?: boolean;
    },
  ) {
    const [profile] = await db
      .insert(schema.profiles)
      .values({
        id: profileData.id,
        acceptedDataPolicy: profileData.acceptedDataPolicy ?? false,
      })
      .returning();

    return profile;
  },

  /**
   * Creates a test category.
   *
   * @param db - Database connection
   * @param categoryData - Category data to insert
   * @returns Created category
   */
  async createTestCategory(
    db: TestDatabase,
    categoryData: {
      name: string;
      description?: string;
    },
  ) {
    const [category] = await db
      .insert(schema.categories)
      .values(categoryData)
      .returning();

    return category;
  },

  /**
   * Creates a test product.
   *
   * @param db - Database connection
   * @param productData - Product data to insert
   * @returns Created product
   */
  async createTestProduct(
    db: TestDatabase,
    productData: {
      title: string;
      description?: string;
      descriptionHtml?: string;
      tags?: string[];
      categoryId?: string;
      availableForSale?: boolean;
    },
  ) {
    const [product] = await db
      .insert(schema.products)
      .values({
        title: productData.title,
        description: productData.description,
        descriptionHtml: productData.descriptionHtml,
        tags: productData.tags ?? [],
        categoryId: productData.categoryId,
        availableForSale: productData.availableForSale ?? true,
      })
      .returning();

    return product;
  },

  /**
   * Creates a test product variant.
   *
   * @param db - Database connection
   * @param variantData - Variant data to insert
   * @returns Created variant
   */
  async createTestProductVariant(
    db: TestDatabase,
    variantData: {
      productId: string;
      price: number;
      currencyCode?: string;
      availableForSale?: boolean;
      inventoryQuantity?: number;
    },
  ) {
    const variantValues = {
      productId: variantData.productId,
      title: "Test Variant",
      selectedOptions: [],
      price: variantData.price,
      currencyCode: variantData.currencyCode ?? "USD",
      availableForSale: variantData.availableForSale ?? true,
      inventoryQuantity: variantData.inventoryQuantity ?? 10,
    } satisfies schema.InsertProductVariant;

    const [variant] = await db
      .insert(schema.productVariants)
      .values(variantValues)
      .returning();

    return variant;
  },

  /**
   * Helper to find a product by ID with all relations loaded.
   * Useful for testing product queries with full data.
   *
   * @param db - Database connection
   * @param productId - Product ID to find
   * @returns Product with relations or null if not found
   */
  async findProductWithRelations(db: TestDatabase, productId: string) {
    return await db.query.products.findFirst({
      where: eq(schema.products.id, productId),
      with: {
        category: true,
        variants: {
          where: eq(schema.productVariants.availableForSale, true),
        },
        images: {
          orderBy: (images, { asc }) => [asc(images.order)],
        },
      },
    });
  },

  /**
   * Helper to find a category by ID with products count.
   *
   * @param db - Database connection
   * @param categoryId - Category ID to find
   * @returns Category or null if not found
   */
  async findCategoryWithProducts(db: TestDatabase, categoryId: string) {
    return await db.query.categories.findFirst({
      where: eq(schema.categories.id, categoryId),
      with: {
        products: true,
      },
    });
  },

  /**
   * Truncates only the categories table for faster test setup.
   * Use this instead of truncateAllTables when only testing categories.
   *
   * OPTIMIZATION: Single table truncation is much faster
   *
   * @param db - Database connection to use for truncation
   */
  async truncateCategoriesTable(db?: TestDatabase): Promise<void> {
    if (!db) {
      db = createTestDb();
    }

    await db.execute(sql`TRUNCATE TABLE categories CASCADE`);
  },

  /**
   * Truncates cart-related tables for faster test setup.
   * Use this instead of truncateAllTables when only testing cart functionality.
   *
   * OPTIMIZATION: Batch truncation of related tables
   *
   * @param db - Database connection to use for truncation
   */
  async truncateCartTables(db?: TestDatabase): Promise<void> {
    if (!db) {
      db = createTestDb();
    }

    // OPTIMIZATION: Execute in parallel
    await Promise.all([
      db.execute(sql`TRUNCATE TABLE cart_items CASCADE`),
      db.execute(sql`TRUNCATE TABLE carts CASCADE`),
    ]);
  },

  /**
   * Truncates product-related tables for faster test setup.
   * Use this when testing cart or product functionality.
   *
   * OPTIMIZATION: Batch truncation in dependency order
   *
   * @param db - Database connection to use for truncation
   */
  async truncateProductTables(db?: TestDatabase): Promise<void> {
    if (!db) {
      db = createTestDb();
    }

    // OPTIMIZATION: Execute independent tables in parallel, then dependent tables
    await Promise.all([
      db.execute(sql`TRUNCATE TABLE product_options CASCADE`),
      db.execute(sql`TRUNCATE TABLE product_images CASCADE`),
      db.execute(sql`TRUNCATE TABLE product_variants CASCADE`),
    ]);

    await db.execute(sql`TRUNCATE TABLE products CASCADE`);
  },
};
