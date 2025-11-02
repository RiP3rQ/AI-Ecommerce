import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { summarizeReviewsService } from "./service";
import { summarizeReviewsSchema } from "./dto";
import type { SummarizeReviewsResponse } from "./types";
import { drizzleDbClient } from "@/database";
import { checkAndSaveAiUsage, validateServerSession } from "@/lib/api-helpers";

/**
 * POST /api/ai/summorize-reviews
 * Generates an AI-powered summary of all reviews for a specific product.
 *
 * Body Parameters:
 * - productId (required): UUID of the product to summarize reviews for
 *
 * @param request - The incoming request
 * @returns Generated review summary with metadata
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<SummarizeReviewsResponse | unknown>> {
  try {
    const dbClient = drizzleDbClient();

    // Step 1: Validate user session
    const user = await validateServerSession();

    // Step 2: Check AI usage
    await checkAndSaveAiUsage({
      dbClient,
      userId: user.id,
    });

    // Step 3: Parse and validate request body
    const body = await request.json();
    const validatedDto = summarizeReviewsSchema.parse(body);

    // Step 4: Generate review summary
    const summaryData = await summarizeReviewsService.summarizeReviews({
      dto: validatedDto,
      db: dbClient,
    });

    // Step 5: Return the summary
    return NextResponse.json(
      {
        success: true,
        data: summaryData,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
