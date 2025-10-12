import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { categoriesService } from "./service";
import { getCategoriesSchema } from "./dto";
import type { CategoriesResponse } from "./types";

/**
 * GET /api/categories
 * Retrieves all categories with optional sorting.
 *
 * Query Parameters:
 * - sortDirection (optional): "asc" | "desc" (default: "asc")
 * - sortField (optional): "name" | "createdAt" | "updatedAt" (default: "name")
 *
 * @param request - The incoming request
 * @returns List of categories
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<CategoriesResponse | unknown>> {
  try {
    // Step 1: Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;

    const queryParams = {
      sortDirection: searchParams.get("sortDirection") as
        | "asc"
        | "desc"
        | undefined,
      sortField: searchParams.get("sortField") as
        | "name"
        | "createdAt"
        | "updatedAt"
        | undefined,
    };

    const validatedDto = getCategoriesSchema.parse(queryParams);

    // Step 2: Get categories from service
    const categoriesData = await categoriesService.getCategories({
      dto: validatedDto,
    });

    return NextResponse.json(
      {
        success: true,
        data: categoriesData,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
