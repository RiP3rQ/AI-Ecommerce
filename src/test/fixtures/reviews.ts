import { faker } from "@faker-js/faker";
import type { TestDatabase } from "../utils/db-helper";
import { InsertReview, reviews, SelectReview } from "@/database/schema";

/**
 * Creates a test profile in the database.
 * Allows overriding default fixture data with provided props.
 *
 * @param db - Database connection
 * @param overrides - Properties to override in the fixture data
 * @returns Created profile record
 */
export async function createReviewFixture({
  db,
  overrides,
}: {
  db: TestDatabase;
  overrides: Partial<InsertReview>;
}): Promise<SelectReview> {
  // Get the base fixture data
  const reviewData = {
    id: overrides.id ?? faker.string.uuid(),
    productId: overrides.productId ?? faker.string.uuid(),
    userId: overrides.userId ?? faker.string.uuid(),
    rating:
      overrides.rating ??
      faker.number.float({ min: 0.5, max: 5, fractionDigits: 1 }).toString(),
    content: overrides.content ?? faker.lorem.sentence(),
    embeddingStatus: overrides.embeddingStatus ?? "pending",
    embedding: overrides.embedding ?? null,
  } satisfies InsertReview;

  const [review] = await db.insert(reviews).values(reviewData).returning();

  return review;
}
