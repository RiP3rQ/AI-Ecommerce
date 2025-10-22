import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { orderService } from "./service";
import type { OrderDetailsResponse } from "./dto";
import { validateServerSession } from "@/lib/api-helpers";
import { drizzleDbClient } from "@/database";

/**
 * GET /api/order/[orderId]
 * Retrieves complete order details by order ID for the authenticated user.
 * Includes all order items with full product and variant information.
 *
 * Path Parameters:
 * - orderId: UUID of the order to retrieve
 *
 * @param request - The incoming request
 * @param context - Route context containing path parameters
 * @returns Complete order details with all item information
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<OrderDetailsResponse | unknown>> {
  try {
    // Step 1: Validate user session
    const user = await validateServerSession();

    // Step 2: Extract and validate path parameters
    const { id: orderId } = await params;

    // Step 3: Fetch order details
    const orderDetails = await orderService.getOrderDetails({
      orderId,
      userId: user.id,
      db: drizzleDbClient(),
    });

    return NextResponse.json(
      {
        success: true,
        data: orderDetails,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
