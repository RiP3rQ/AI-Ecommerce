import {
  categories,
  type InsertCategory,
  type SelectCategory,
} from "../../database/schemas/categories";
import type { TestDatabase } from "../utils/db-helper";
import { faker } from "@faker-js/faker";

/**
 * Creates a test category in the database.
 * Allows overriding default fixture data with provided props.
 *
 * @param db - Database connection
 * @param overrides - Properties to override in the fixture data
 * @returns Created category record
 */
export async function createCategoryFixture({
  db,
  overrides,
}: {
  db: TestDatabase;
  overrides: Partial<InsertCategory>;
}): Promise<SelectCategory> {
  // Get the base fixture data
  const categoryData = {
    id: overrides.id,
    name: overrides.name ?? faker.commerce.department(),
    description: overrides.description ?? faker.commerce.productDescription(),
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date(),
  } satisfies InsertCategory;

  const [category] = await db
    .insert(categories)
    .values(categoryData)
    .returning();

  return category;
}

/**
 * Creates multiple test categories in batch for better performance.
 * Allows overriding default fixture data with provided props.
 *
 * @param db - Database connection
 * @param count - Number of categories to create
 * @param overrides - Array of override objects, one per category
 * @returns Created category records
 */
export async function createCategoryFixtures({
  db,
  count,
  overrides = [],
}: {
  db: TestDatabase;
  count: number;
  overrides?: Partial<InsertCategory>[];
}): Promise<SelectCategory[]> {
  const categoriesData = Array.from({ length: count }, (_, index) => {
    const override = overrides[index] || {};
    return {
      id: override.id,
      name: override.name ?? faker.commerce.department(),
      description: override.description ?? faker.commerce.productDescription(),
      createdAt: override.createdAt ?? new Date(),
      updatedAt: override.updatedAt ?? new Date(),
    } satisfies InsertCategory;
  });

  return await db.insert(categories).values(categoriesData).returning();
}
