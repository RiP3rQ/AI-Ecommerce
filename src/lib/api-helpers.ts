"use server";

import { createServerSupabaseClient } from "@/supabase-auth/server";
import { UnauthorizedError, UserNotFoundError } from "./errors";
import { AiUsageLimitExceededError } from "./errors/ai-errors";
import type { User } from "@supabase/supabase-js";
import type { DrizzleDbClient } from "@/database";
import { profiles } from "@/database/schemas/profiles";
import { eq } from "drizzle-orm";

/**
 * Validates user session and returns the authenticated user.
 * @param request - The incoming request
 * @returns The authenticated user
 * @throws UnauthorizedError if user is not authenticated
 */
export async function validateServerSession(): Promise<User> {
  const supabaseServer = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}

/**
 * Checks and saves AI usage for a user with automatic reset handling.
 * Resets usage count if reset time has passed and updates the reset timestamp.
 * @param dbClient - The database client
 * @param userId - The user ID
 * @throws UserNotFoundError if profile not found
 * @throws AiUsageLimitExceededError if usage limit exceeded
 */
export async function checkAndSaveAiUsage({
  dbClient,
  userId,
}: {
  dbClient: DrizzleDbClient;
  userId: string;
}): Promise<void> {
  const profile = await dbClient.query.profiles.findFirst({
    where: eq(profiles.id, userId),
  });

  if (!profile) {
    throw new UserNotFoundError(`Profile for user ${userId} not found`);
  }

  const now = new Date();

  // Check if we need to reset the usage count
  if (now >= profile.aiUsageResetAt) {
    // Reset count and move reset_at to 30 days from now
    const nextResetAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await dbClient
      .update(profiles)
      .set({
        aiUsageCount: 1, // Start with 1 usage after reset
        aiUsageResetAt: nextResetAt,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, userId));

    return;
  }

  // Check if limit would be exceeded before incrementing
  if (profile.aiUsageCount >= profile.aiUsageLimit) {
    throw new AiUsageLimitExceededError(
      `You've reached your AI usage limit. Please try again later.`,
    );
  }

  // Increment usage count
  const aiUsage = profile.aiUsageCount + 1;
  await dbClient
    .update(profiles)
    .set({ aiUsageCount: aiUsage, updatedAt: new Date() })
    .where(eq(profiles.id, userId));
}
