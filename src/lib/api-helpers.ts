"use server";

import { createServerSupabaseClient } from "@/supabase-auth/server";
import { UnauthorizedError } from "./errors";
import { User } from "@supabase/supabase-js";

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
