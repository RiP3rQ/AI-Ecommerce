import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { reviewService } from "./service";
import { type CreateReviewDto, createReviewSchema, getReviewsSchema } from "./dto";
import type { ReviewsResponse, CreateReviewResponse } from "./types";
import { validateServerSession } from "@/lib/api-helpers";
import { drizzleDbClient } from "@/database";

/**
 * GET /api/review
 * Retrieves reviews with filtering and pagination.
 *
 * Query Parameters:
 * - page (optional): Page number (default: 1)
 * - limit (optional): Items per page (default: 20, max: 100)
 * - productId: Filter by product UUID
 *
 * @param request - The incoming request
 * @returns Paginated reviews with filtering applied
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<ReviewsResponse | unknown>> {
  try {
    // Step 1: Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;

    const queryParams = {
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page")!)
        : 1,
      limit: searchParams.get("limit")
        ? Number.parseInt(searchParams.get("limit")!)
        : 20,
      productId: searchParams.get("productId"),
    };

    const validatedDto = getReviewsSchema.parse(queryParams);

    // Step 2: Get reviews from service
    const reviewsData = await reviewService.getReviews({
      dto: validatedDto,
      db: drizzleDbClient(),
    });

    return NextResponse.json(
      {
        success: true,
        data: reviewsData,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

/**
 * POST /api/review
 * Creates a new review for a product.
 *
 * Body Parameters:
 * - productId (required): UUID of the product
 * - content (required): Review content (10-1000 characters)
 * - rating (required): Rating from 0.5 to 5.0
 *
 * @param request - The incoming request
 * @returns Created review data
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<CreateReviewResponse | unknown>> {
  try {
    // Step 1: Validate user session
    const user = await validateServerSession();

    // Step 2: Parse and validate request body
    const body = await request.json();
    const validatedDto = createReviewSchema.parse(body);

    // Step 3: Create the review
    const newReview = await reviewService.createReview({
      dto: validatedDto,
      userId: user.id,
      db: drizzleDbClient(),
    });

    return NextResponse.json(
      {
        success: true,
        data: newReview,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
