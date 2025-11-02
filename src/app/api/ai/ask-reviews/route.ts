import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { askReviewsService } from "./service";
import { askReviewsSchema } from "./dto";
import type { AskReviewsResponse } from "./types";
import { drizzleDbClient } from "@/database";
import { validateServerSession } from "@/lib/api-helpers";

/**
 * POST /api/ai/ask-reviews
 * Answers questions about products using relevant customer reviews and AI.
 *
 * Body Parameters:
 * - productId (required): UUID of the product to ask about
 * - question (required): The customer's question (5-500 characters)
 * - maxReviews (optional): Maximum reviews to include (1-20, default: 5)
 *
 * @param request - The incoming request
 * @returns AI-generated answer based on relevant customer reviews
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<AskReviewsResponse | unknown>> {
  try {
    // Step 1: Validate user session
    await validateServerSession();

    // Step 2: Parse and validate request body
    const body = await request.json();
    const validatedDto = askReviewsSchema.parse(body);

    // Step 3: Generate answer using AI and review embeddings
    const answerData = await askReviewsService.askReviews({
      dto: validatedDto,
      db: drizzleDbClient(),
    });

    return NextResponse.json(
      {
        success: true,
        data: answerData,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
