import { NextResponse, type NextRequest } from "next/server";
import { handleApiError } from "@/lib/errors";
import { suggestProductsService } from "./service";
import { checkAndSaveAiUsage, validateServerSession } from "@/lib/api-helpers";
import { CartItemWithDetails } from "../../cart/types";
import { cartService } from "../../cart/service";
import { drizzleDbClient } from "@/database";
import { ProductData } from "../../product/[id]/types";

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
export async function POST(request: NextRequest): Promise<
  NextResponse<
    | {
        success: boolean;
        data: Array<{
          productId: string;
          reason: string;
          productData?: ProductData;
        }>;
      }
    | unknown
  >
> {
  try {
    const dbClient = drizzleDbClient();

    // Step 1: Validate session
    const user = await validateServerSession();

    // Step 2: Check AI usage
    await checkAndSaveAiUsage({
      dbClient,
      userId: user.id,
    });

    // Step 3: Get cart items
    const cartItems = await cartService.getCart({
      userId: user.id,
      db: dbClient,
    });

    // Step 4: Generate streaming product suggestions using RAG
    const suggestedProducts = await suggestProductsService.suggestProducts({
      cartItems: cartItems.cart.items,
    });

    // Step 5: Return the streaming response directly
    return NextResponse.json(
      {
        success: true,
        data: suggestedProducts,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
