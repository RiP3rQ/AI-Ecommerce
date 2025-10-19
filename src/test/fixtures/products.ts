import { faker } from "@faker-js/faker";
import {
  products,
  type InsertProduct,
  type SelectProduct,
} from "../../database/schemas/products";
import {
  productVariants,
  type InsertProductVariant,
  type SelectProductVariant,
} from "../../database/schemas/product-variants";
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
    categoryId: overrides.categoryId ?? null,
    availableForSale: overrides.availableForSale ?? true,
  } satisfies InsertProduct;

  const [product] = await db.insert(products).values(productData).returning();

  return product;
}

/**
 * Creates a test product variant in the database.
 * Allows overriding default fixture data with provided props.
 *
 * @param db - Database connection
 * @param overrides - Properties to override in the fixture data
 * @returns Created product variant record
 */
export async function createProductVariantFixture({
  db,
  overrides,
}: {
  db: TestDatabase;
  overrides: Partial<InsertProductVariant>;
}): Promise<SelectProductVariant> {
  // Get the base fixture data
  const variantData = {
    productId: overrides.productId ?? faker.string.uuid(),
    title: overrides.title ?? "Default Variant",
    selectedOptions: overrides.selectedOptions ?? [],
    price: overrides.price ?? faker.number.int({ min: 100, max: 10000 }), // $1.00 to $100.00
    currencyCode: overrides.currencyCode ?? "USD",
    availableForSale: overrides.availableForSale ?? true,
    inventoryQuantity: overrides.inventoryQuantity ?? 10,
  } satisfies InsertProductVariant;

  const [variant] = await db
    .insert(productVariants)
    .values(variantData)
    .returning();

  return variant;
}

/**
 * Creates multiple product variants with provided overrides.
 * Useful for bulk seeding test data.
 *
 * @param db - Database connection
 * @param count - Number of variants to create
 * @param overrides - Array of override objects, one per variant
 * @returns Array of created product variants
 */
export async function createProductVariantFixtures({
  db,
  count,
  overrides = [],
}: {
  db: TestDatabase;
  count: number;
  overrides?: Partial<InsertProductVariant>[];
}): Promise<SelectProductVariant[]> {
  const variants: SelectProductVariant[] = [];

  for (let i = 0; i < count; i++) {
    const override = overrides[i] || {};
    const variant = await createProductVariantFixture({
      db,
      overrides: override,
    });
    variants.push(variant);
  }

  return variants;
}
