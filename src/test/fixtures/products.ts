import { faker } from "@faker-js/faker";
import {
  products,
  type InsertProduct,
  type SelectProduct,
} from "../../database/schemas/products";
import type { TestDatabase } from "../utils/db-helper";

/**
 * Creates a test product in the database.
 * Allows overriding default fixture data with provided props.
 *
 * @param db - Database connection
 * @param overrides - Properties to override in the fixture data
 * @returns Created product record
 */
export async function createProductFixture({
  db,
  overrides,
}: {
  db: TestDatabase;
  overrides: Partial<InsertProduct>;
}): Promise<SelectProduct> {
  // Get the base fixture data
  const productData = {
    title: overrides.title ?? faker.commerce.productName(),
    description: overrides.description ?? faker.commerce.productDescription(),
    descriptionHtml:
      overrides.descriptionHtml ?? faker.commerce.productDescription(),
    tags: overrides.tags ?? [faker.commerce.productMaterial()],
    categoryId: overrides.categoryId ?? faker.string.uuid(),
    availableForSale: overrides.availableForSale ?? true,
  } satisfies InsertProduct;

  const [product] = await db.insert(products).values(productData).returning();

  return product;
}
