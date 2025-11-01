import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { registerService } from "./service";
import { registerUserSchema } from "./dto";
import { drizzleDbClient } from "@/database";

/**
 * POST /api/register
 * Creates a profile record for a newly registered user.
 *
 * Request Body:
 * - email: User's email address
 * - userId: UUID of the user from Supabase auth
 *
 * @param request - The incoming request
 * @returns Success response with created profile data
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    // Step 1: Parse and validate request body
    const body = await request.json();
    const validatedDto = registerUserSchema.parse(body);

    // Step 2: Create profile in database
    const profile = await registerService.createProfile({
      dto: validatedDto,
      db: drizzleDbClient(),
    });

    return NextResponse.json(
      {
        success: true,
        data: profile,
        message: "Profile created successfully.",
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}