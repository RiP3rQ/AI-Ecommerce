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
