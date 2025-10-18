import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql, eq, and, DrizzleError } from "drizzle-orm";
import { env } from "../../env";
import * as schema from "../../database/schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

/**
 * Database connection type for testing
 */
export type TestDatabase = PostgresJsDatabase<typeof schema>;

/**
 * Creates a test database connection.
 * This should be used for test-specific database operations.
 */
export function createTestDb(): TestDatabase {
  const client = postgres(process.env.DATABASE_URL!, {
    prepare: false,
    // Suppress NOTICE messages from PostgreSQL
    connection: {
      client_min_messages: "warning",
    },
  });
  return drizzle(client, { schema, logger: false });
}

/**
 * Creates a testable unit using database transactions.
 * The transaction is automatically rolled back after the test function completes,
 * ensuring test isolation without affecting other tests.
 *
 * @param func - Test function that receives a database connection
 * @returns Promise that resolves when the test function completes
 */
export async function createTestableUnit(
  func: (db: TestDatabase) => Promise<void>
): Promise<void> {
  const db = createTestDb();

  try {
    await db.transaction(async (tx) => {
      await func(tx);
      tx.rollback();
    });
  } catch (error) {
    if (error instanceof DrizzleError) {
      // ignore
      console.log("[Drizzle] DB Error:", error.message);
    } else {
      console.error("[TEST] Error:", error);
      throw error;
    }
  }
}

/**
 * Database utility helpers for testing.
 * Provides common database operations that can be used across tests.
 */
export const dbHelpers = {
  /**
   * Truncates all data from all tables while preserving schema.
   * Tables are truncated in dependency order to avoid foreign key constraints.
   *
   * @param db - Database connection to use for truncation
   */
  async truncateAllTables(db?: TestDatabase): Promise<void> {
    if (!db) {
      db = createTestDb();
    }

    // Truncate tables in reverse dependency order
    // Child tables first, then parent tables
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

    for (const query of truncateQueries) {
      await db.execute(query);
    }
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
    }
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
    }
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
    }
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
    }
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
};
