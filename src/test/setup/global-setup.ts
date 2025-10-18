import { sql } from "drizzle-orm";
import { drizzleDb } from "../../db/connection";

export async function setup() {
  console.log("🧪 Setting up test environment...");

  // Ensure we're in test environment
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      "Global setup can only be used in test environment. Set NODE_ENV=test"
    );
  }

  try {
    // Clean data from all tables (but keep schema)
    console.log("🗄️  Cleaning test database data...");
    await drizzleDb.execute(sql`TRUNCATE TABLE stock CASCADE`);
    await drizzleDb.execute(sql`TRUNCATE TABLE products CASCADE`);
    await drizzleDb.execute(sql`TRUNCATE TABLE categories CASCADE`);
    await drizzleDb.execute(sql`TRUNCATE TABLE better_auth_sessions CASCADE`);
    await drizzleDb.execute(sql`TRUNCATE TABLE better_auth_accounts CASCADE`);
    await drizzleDb.execute(
      sql`TRUNCATE TABLE better_auth_verifications CASCADE`
    );
    await drizzleDb.execute(sql`TRUNCATE TABLE better_auth_users CASCADE`);

    console.log("✅ Test environment setup complete");
  } catch (error) {
    console.error("❌ Failed to setup test environment:", error);
    throw error;
  }
}

export async function teardown() {
  console.log("🧹 Global teardown...");

  try {
    // Clean data from all tables after tests
    console.log("🗄️ Cleaning test database data after tests...");
    await drizzleDb.execute(sql`TRUNCATE TABLE stock CASCADE`);
    await drizzleDb.execute(sql`TRUNCATE TABLE products CASCADE`);
    await drizzleDb.execute(sql`TRUNCATE TABLE categories CASCADE`);
    await drizzleDb.execute(sql`TRUNCATE TABLE better_auth_sessions CASCADE`);
    await drizzleDb.execute(sql`TRUNCATE TABLE better_auth_accounts CASCADE`);
    await drizzleDb.execute(
      sql`TRUNCATE TABLE better_auth_verifications CASCADE`
    );
    await drizzleDb.execute(sql`TRUNCATE TABLE better_auth_users CASCADE`);
  } catch (error) {
    console.warn("⚠️  Failed to clean database during teardown:", error);
  }

  console.log("✅ Global teardown complete");
  // Close the database connection
  await drizzleDb.$client.end();
  console.log("🔌 Database connection closed");

  // End the test
  console.log("🏁 Finished tests");
  process.exit(0);
}
