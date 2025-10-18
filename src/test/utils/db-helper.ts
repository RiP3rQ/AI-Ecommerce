import {
  betterAuthUsers,
  betterAuthSessions,
  betterAuthAccounts,
  betterAuthVerifications,
  categories,
  products,
  stock,
  shops,
} from "../../db/schema";
import { DrizzleError, sql, Table } from "drizzle-orm";
import { drizzleDb, type TransactionDb } from "../../db/connection";

export async function createTestableUnit(
  func: (tx: TransactionDb) => Promise<void>
) {
  try {
    await drizzleDb.transaction(async (tx) => {
      await func(tx);
      tx.rollback();
    });
  } catch (error) {
    if (error instanceof DrizzleError) {
      // ignore
      console.log("Drizzle error:", error.message);
    } else {
      console.error("Error:", error);
      throw error;
    }
  }
}

/**
 * Database utility helpers for testing
 */
export const dbHelpers = {
  /**
   * Clean all data from all tables
   * This is useful for ensuring test isolation
   */
  async cleanDb(): Promise<void> {
    // Clear in dependency order to avoid foreign key constraints
    // Delete child tables first, then parent tables
    try {
      await drizzleDb.delete(stock); // References products
      await drizzleDb.delete(products); // References categories
      await drizzleDb.delete(categories); // No foreign dependencies
      await drizzleDb.delete(shops); // References users as managers
      await drizzleDb.delete(betterAuthSessions); // References users
      await drizzleDb.delete(betterAuthAccounts); // References users
      await drizzleDb.delete(betterAuthVerifications); // No foreign dependencies
      await drizzleDb.delete(betterAuthUsers); // Parent table
    } catch (error) {
      console.error("Error cleaning database:", error);
      throw error;
    }
  },
};
