import { type NextRequest } from "next/server";
import { handleApiError } from "@/lib/errors";
import { suggestProductsService } from "./service";
import { suggestProductsSchema } from "./dto";
import { validateServerSession } from "@/lib/api-helpers";

/**
 * POST /api/ai/suggest-products
 * Generates AI-powered product suggestions based on items in the user's cart using RAG.
 *
 * Request Body:
 * - cartItems: Array of cart items with product details
 * - maxSuggestions: Optional number of suggestions to return (default: 5, max: 10)
 *
 * @param request - The incoming request
 * @returns Streaming AI response with product suggestions
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Validate session
    await validateServerSession();

    // Step 2: Validate request body
    const body = await request.json();
    const validatedDto = suggestProductsSchema.parse(body);

    // Step 3: Generate streaming product suggestions using RAG
    const result = await suggestProductsService.suggestProducts(validatedDto);

    // Return the streaming response directly
    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
