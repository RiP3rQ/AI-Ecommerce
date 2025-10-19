import { faker } from "@faker-js/faker";
import {
  productImages,
  type InsertProductImage,
  type SelectProductImage,
} from "../../database/schemas/product-images";
import type { TestDatabase } from "../utils/db-helper";

/**
 * Creates a test product image in the database.
 * Allows overriding default fixture data with provided props.
 *
 * @param db - Database connection
 * @param overrides - Properties to override in the fixture data
 * @returns Created product image record
 */
export async function createProductImageFixture({
  db,
  overrides,
}: {
  db: TestDatabase;
  overrides: Partial<InsertProductImage>;
}): Promise<SelectProductImage> {
  // Get the base fixture data
  const imageData = {
    id: overrides.id ?? faker.string.uuid(),
    productId: overrides.productId ?? faker.string.uuid(),
    url: overrides.url ?? faker.image.url(),
    altText: overrides.altText ?? faker.commerce.productName(),
    order: overrides.order ?? 0,
    width: overrides.width ?? faker.number.int({ min: 100, max: 2000 }),
    height: overrides.height ?? faker.number.int({ min: 100, max: 2000 }),
  } satisfies InsertProductImage;

  const [image] = await db.insert(productImages).values(imageData).returning();

  return image;
}

/**
 * Creates multiple product images with provided overrides.
 * Useful for bulk seeding test data.
 *
 * @param db - Database connection
 * @param count - Number of images to create
 * @param overrides - Array of override objects, one per image
 * @returns Array of created product images
 */
export async function createProductImageFixtures({
  db,
  count,
  overrides = [],
}: {
  db: TestDatabase;
  count: number;
  overrides?: Partial<InsertProductImage>[];
}): Promise<SelectProductImage[]> {
  const images: SelectProductImage[] = [];

  for (let i = 0; i < count; i++) {
    const override = overrides[i] || {};
    const image = await createProductImageFixture({
      db,
      overrides: override,
    });
    images.push(image);
  }

  return images;
}
