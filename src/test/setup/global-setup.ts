import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { env } from "../../env";
import { sql } from "drizzle-orm";
import * as schema from "../../database/schema";

/**
 * Global setup for test environment.
 * Initializes test database with migrations and ensures clean state.
 */
export async function setup() {
  console.log("🧪 Setting up test environment...");

  // Ensure we're in test environment
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      "Global setup can only be used in test environment. Set NODE_ENV=test"
    );
  }

  try {
    // Create database connection for migrations
    console.log("🔗 Connecting to test database...");
    const client = postgres(env.DATABASE_URL, { prepare: false, max: 1 });
    const db = drizzle(client, { schema });

    // Run migrations to ensure schema is up to date
    console.log("📦 Running database migrations...");
    await migrate(db, {
      migrationsFolder: "./src/database/migrations",
    });

    // Clean all data from tables to ensure clean test state
    console.log("🗄️  Cleaning test database data...");
    await cleanAllTables(db);

    // Close the connection
    await client.end();

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
  console.log("🧹 Global teardown...");

  try {
    // Create database connection for cleanup
    const client = postgres(env.DATABASE_URL, { prepare: false, max: 1 });
    const db = drizzle(client, { schema });

    // Clean all data from tables
    console.log("🗄️ Cleaning test database data after tests...");
    await cleanAllTables(db);

    // Close the connection
    await client.end();
    console.log("🔌 Database connection closed");
  } catch (error) {
    console.warn("⚠️  Failed to clean database during teardown:", error);
  }

  console.log("✅ Global teardown complete");
  console.log("🏁 Finished tests");
  process.exit(0);
}

/**
 * Cleans all data from all tables while preserving schema.
 * Tables are truncated in dependency order to avoid foreign key constraints.
 */
async function cleanAllTables(db: ReturnType<typeof drizzle>) {
  // Truncate tables in reverse dependency order
  // Child tables first, then parent tables
  const truncateQueries = [
    sql`TRUNCATE TABLE reviews CASCADE`,
    sql`TRUNCATE TABLE cart CASCADE`,
    sql`TRUNCATE TABLE orders CASCADE`,
    sql`TRUNCATE TABLE product_options CASCADE`,
    sql`TRUNCATE TABLE product_images CASCADE`,
    sql`TRUNCATE TABLE product_variants CASCADE`,
    sql`TRUNCATE TABLE products CASCADE`,
    sql`TRUNCATE TABLE categories CASCADE`,
    sql`TRUNCATE TABLE profiles CASCADE`,
  ];

  for (const query of truncateQueries) {
    await db.execute(query);
  }
}
