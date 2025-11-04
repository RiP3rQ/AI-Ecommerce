import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { env } from "../../env";
import { sql } from "drizzle-orm";
import * as schema from "../../database/schema";
import { closePool } from "../utils/db-helper";

// Cache to track if migrations have already been run in this test session
const migrationCache = {
  isInitialized: false,
  lastInitTime: 0,
};

/**
 * Global setup for test environment.
 * Initializes test database with migrations only once per test session.
 * Subsequent setups skip migrations for faster execution.
 */
export async function setup() {
  // Ensure we're in test environment
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      "Global setup can only be used in test environment. Set NODE_ENV=test",
    );
  }

  try {
    // OPTIMIZATION: Skip migrations if already initialized in this session
    if (migrationCache.isInitialized) {
      console.log(
        "✅ Test environment already initialized (skipping migrations)",
      );
      return;
    }

    // Create database connection for migrations
    const client = postgres(process.env.DATABASE_URL!, {
      prepare: false,
      // Suppress NOTICE messages from PostgreSQL
      connection: {
        client_min_messages: "warning",
      },
    });
    const db = drizzle(client, { schema, logger: false });

    // Run migrations to ensure schema is up to date
    // OPTIMIZATION: Only runs once per test session
    console.log("⏳ Running database migrations...");
    const start = performance.now();
    try {
      await migrate(db, {
        migrationsFolder: "./src/database/migrations",
      });
      const duration = (performance.now() - start).toFixed(2);
      console.log(`✅ Migrations completed in ${duration}ms`);
    } catch (error) {
      console.warn("⚠️  Migrations may have already been applied, continuing...");
      console.error("Migration error:", error);
    }

    // OPTIMIZATION: Clean all data from tables to ensure clean test state
    // This is much faster than recreating schema
    await cleanAllTables(db);

    // Close the connection
    await client.end();

    // Mark as initialized
    migrationCache.isInitialized = true;
    migrationCache.lastInitTime = Date.now();

    console.log("✅ Test environment setup complete");
  } catch (error) {
    console.error("❌ Failed to setup test environment:", error);
    throw error;
  }
}

/**
 * Global teardown for test environment.
 * Cleans up after all tests are complete.
 */
export async function teardown() {
  try {
    // Close the shared connection pool first
    await closePool();

    // Create a separate connection for final cleanup
    const client = postgres(env.DATABASE_URL, {
      prepare: false,
      max: 1,
      // Suppress NOTICE messages from PostgreSQL
      connection: {
        client_min_messages: "warning",
      },
    });
    const db = drizzle(client, { schema });

    // Clean all data from tables
    await cleanAllTables(db);

    // Close the cleanup connection
    await client.end();

    // Reset migration cache
    migrationCache.isInitialized = false;

    console.log("✅ Test environment teardown complete");
  } catch (error) {
    console.warn("⚠️  Failed to clean database during teardown:", error);
  }

  console.log("🏁 Finished tests");
  process.exit(0);
}

/**
 * Cleans all data from all tables while preserving schema.
 * Tables are truncated in dependency order to avoid foreign key constraints.
 * This is significantly faster than re-running migrations.
 */
async function cleanAllTables(db: ReturnType<typeof drizzle>) {
  // OPTIMIZATION: Use concurrent truncation for faster cleanup
  // Truncate tables in reverse dependency order (child tables first)
  const truncateQueries = [
    sql`TRUNCATE TABLE reviews CASCADE`,
    sql`TRUNCATE TABLE carts CASCADE`,
    sql`TRUNCATE TABLE orders CASCADE`,
    sql`TRUNCATE TABLE product_options CASCADE`,
    sql`TRUNCATE TABLE product_images CASCADE`,
    sql`TRUNCATE TABLE product_variants CASCADE`,
    sql`TRUNCATE TABLE products CASCADE`,
    sql`TRUNCATE TABLE categories CASCADE`,
    sql`TRUNCATE TABLE profiles CASCADE`,
  ];

  // OPTIMIZATION: Execute in batches for better performance
  // Group related truncations together
  await Promise.all([
    db.execute(truncateQueries[0]), // reviews
    db.execute(truncateQueries[1]), // carts
    db.execute(truncateQueries[2]), // orders
  ]);

  await Promise.all([
    db.execute(truncateQueries[3]), // product_options
    db.execute(truncateQueries[4]), // product_images
    db.execute(truncateQueries[5]), // product_variants
  ]);

  await db.execute(truncateQueries[6]); // products
  await db.execute(truncateQueries[7]); // categories
  await db.execute(truncateQueries[8]); // profiles
}
