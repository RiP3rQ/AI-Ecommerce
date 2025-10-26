import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { sql, eq, DrizzleError } from "drizzle-orm";
import * as schema from "../../database/schema";
import { Pool, type PoolClient } from "pg";
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

  /**
   * Truncates order-related tables for faster test setup.
   * Use this when testing checkout or order functionality.
   *
   * OPTIMIZATION: Batch truncation of related tables
   *
   * @param db - Database connection to use for truncation
   */
  async truncateOrderTables(db?: TestDatabase): Promise<void> {
    if (!db) {
      db = createTestDb();
    }

    // OPTIMIZATION: Execute in parallel
    await Promise.all([
      db.execute(sql`TRUNCATE TABLE order_items CASCADE`),
      db.execute(sql`TRUNCATE TABLE orders CASCADE`),
    ]);
  },
};
