import { faker } from "@faker-js/faker";
import {
  profiles,
  type InsertProfile,
  type SelectProfile,
} from "../../database/schemas/profiles";
import type { TestDatabase } from "../utils/db-helper";

/**
 * Creates a test profile in the database.
 * Allows overriding default fixture data with provided props.
 *
 * @param db - Database connection
 * @param overrides - Properties to override in the fixture data
 * @returns Created profile record
 */
export async function createProfileFixture({
  db,
  overrides,
}: {
  db: TestDatabase;
  overrides: Partial<InsertProfile>;
}): Promise<SelectProfile> {
  // Get the base fixture data
  const profileData = {
    id: overrides.id ?? faker.string.uuid(),
    acceptedDataPolicy: overrides.acceptedDataPolicy ?? false,
  } satisfies InsertProfile;

  const [profile] = await db.insert(profiles).values(profileData).returning();

  return profile;
}
