import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { mainPageService } from "./service";
import type { MainPageResponse } from "./types";
import { drizzleDbClient } from "@/database";
import { validateServerSession } from "@/lib/api-helpers";

/**
 * GET /api/main-page
 * Retrieves the latest products data for the main page.
 *
 * Requires authentication.
 *
 * @param request - The incoming request
 * @returns Latest products data for main page
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<MainPageResponse | unknown>> {
  try {
    // Step 1: Validate user session
    await validateServerSession();

    // Step 2: Get main page data from service
    const latestProducts = await mainPageService.getLatestProducts({
      db: drizzleDbClient(),
    });

    return NextResponse.json(
      {
        success: true,
        data: latestProducts,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
