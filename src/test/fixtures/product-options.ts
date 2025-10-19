import { faker } from "@faker-js/faker";
import {
  productOptions,
  type InsertProductOption,
  type SelectProductOption,
} from "../../database/schemas/product-options";
import type { TestDatabase } from "../utils/db-helper";

/**
 * Creates a test product option in the database.
 * Allows overriding default fixture data with provided props.
 *
 * @param db - Database connection
 * @param overrides - Properties to override in the fixture data
 * @returns Created product option record
 */
export async function createProductOptionFixture({
  db,
  overrides,
}: {
  db: TestDatabase;
  overrides: Partial<InsertProductOption>;
}): Promise<SelectProductOption> {
  // Get the base fixture data
  const optionData = {
    productId: overrides.productId ?? faker.string.uuid(),
    name: overrides.name ?? faker.commerce.productMaterial(),
    position: overrides.position ?? 0,
    values: overrides.values ?? [faker.color.human(), faker.color.human()],
  } satisfies InsertProductOption;

  const [option] = await db
    .insert(productOptions)
    .values(optionData)
    .returning();

  return option;
}

/**
 * Creates multiple product options with provided overrides.
 * Useful for bulk seeding test data.
 *
 * @param db - Database connection
 * @param count - Number of options to create
 * @param overrides - Array of override objects, one per option
 * @returns Array of created product options
 */
export async function createProductOptionFixtures({
  db,
  count,
  overrides = [],
}: {
  db: TestDatabase;
  count: number;
  overrides?: Partial<InsertProductOption>[];
}): Promise<SelectProductOption[]> {
  const options: SelectProductOption[] = [];

  for (let i = 0; i < count; i++) {
    const override = overrides[i] || {};
    const option = await createProductOptionFixture({
      db,
      overrides: override,
    });
    options.push(option);
  }

  return options;
}
