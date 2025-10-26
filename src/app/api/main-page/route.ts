import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { mainPageService } from "./service";
import type { MainPageResponse } from "./types";
import { drizzleDbClient } from "@/database";
import { getMainPageSchema } from "./dto";

/**
 * GET /api/main-page
 * Retrieves the latest products data for the main page.
 *
 * @param request - The incoming request
 * @returns Latest products data for main page
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<MainPageResponse | unknown>> {
  try {
    // Step 1: Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;

    const queryParams = {
      limit: searchParams.get("limit")
        ? Number.parseInt(searchParams.get("limit")!)
        : 3,
      skipFirstNumberOfProducts: searchParams.get("skipFirstNumberOfProducts")
        ? Number.parseInt(searchParams.get("skipFirstNumberOfProducts")!)
        : 0,
    };

    // Step 2: Validate query parameters
    const validatedDto = getMainPageSchema.parse(queryParams);

    // Step 3: Get main page data from service
    const latestProducts = await mainPageService.getLatestProducts({
      dto: validatedDto,
      db: drizzleDbClient(),
    });

    return NextResponse.json(
      {
        success: true,
        data: latestProducts,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
