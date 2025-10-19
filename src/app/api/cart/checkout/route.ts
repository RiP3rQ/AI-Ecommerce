import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { checkoutService } from "./service";
import type { CheckoutResponse } from "./dto";
import { validateServerSession } from "@/lib/api-helpers";
import { drizzleDbClient } from "@/database";

/**
 * POST /api/cart/checkout
 * Completes the checkout process for the current user's cart.
 * Creates an order from cart items and clears the cart.
 *
 * Request Body: None required (processes current cart)
 *
 * @param request - The incoming request
 * @returns Checkout completion response with order details
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<CheckoutResponse | unknown>> {
  try {
    // Step 1: Validate session
    const user = await validateServerSession();

    // Step 2: Complete checkout
    const checkoutResult = await checkoutService.completeCheckout({
      userId: user.id,
      db: drizzleDbClient(),
    });

    return NextResponse.json(
      {
        success: true,
        ...checkoutResult,
        message: "Purchase completed successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
