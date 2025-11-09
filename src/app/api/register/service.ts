import { type DrizzleDbClient, drizzleDbClient } from "@/database/index";
import { profiles } from "@/database/schemas/profiles";
import type { RegisterUserDto } from "./dto";
import type { SelectProfile } from "@/database/schemas/profiles";

/**
 * Service class for user registration operations.
 * Handles profile creation and related business logic.
 */
export class RegisterService {
  /**
   * Creates a new profile record for a registered user.
   * Sets acceptedDataPolicy to true as required by the registration flow.
   *
   * @param dto - The validated registration data
   * @param db - Database connection
   * @returns The created profile record
   */
  public async createProfile({
    dto,
    db,
  }: Readonly<{
    dto: RegisterUserDto;
    db: DrizzleDbClient;
  }>): Promise<SelectProfile> {
    const [profile] = await db
      .insert(profiles)
      .values({
        id: dto.userId,
        email: dto.email,
        acceptedDataPolicy: true,
        updatedAt: new Date(),
      })
      .returning();

    return profile;
  }
}

export const registerService = new RegisterService();
