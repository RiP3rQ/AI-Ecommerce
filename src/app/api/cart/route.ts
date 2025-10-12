import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { cartService } from "./service";
import {
  addItemToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
  getCartSchema,
} from "./dto";
import type { CartResponse, DeleteCartItemResponse } from "./types";
import { validateServerSession } from "@/lib/api-helpers";

/**
 * GET /api/cart
 * Retrieves the current user's cart with all items and product details.
 *
 * Query Parameters:
 * - cartId (optional): Specific cart ID to retrieve (for future use)
 *
 * @param request - The incoming request
 * @returns Cart summary with items
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<CartResponse | unknown>> {
  try {
    // Step 1: Validate session
    const user = await validateServerSession();

    // Step 2: Validate query parameters (optional)
    const searchParams = request.nextUrl.searchParams;
    const cartId = searchParams.get("cartId");
    getCartSchema.parse({ cartId: cartId || undefined });

    // Step 3: Get cart from service
    const cartSummary = await cartService.getCart({ userId: user.id });

    return NextResponse.json(
      {
        success: true,
        data: cartSummary,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

/**
 * POST /api/cart
 * Adds an item to the cart or updates quantity if it already exists.
 *
 * Request Body:
 * - productVariantId: UUID of the product variant to add
 * - quantity: Number of items to add (must be >= 1)
 *
 * @param request - The incoming request
 * @returns Updated cart summary
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<CartResponse | unknown>> {
  try {
    // Step 1: Validate session
    const user = await validateServerSession();

    // Step 2: Validate request body
    const body = await request.json();
    const validatedDto = addItemToCartSchema.parse(body);

    // Step 3: Add item to cart
    const cartSummary = await cartService.addItemToCart({
      userId: user.id,
      dto: validatedDto,
    });

    return NextResponse.json(
      {
        success: true,
        data: cartSummary,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/cart
 * Updates the quantity of an existing cart item.
 *
 * Request Body:
 * - cartItemId: UUID of the cart item to update
 * - quantity: New quantity (must be >= 1)
 *
 * @param request - The incoming request
 * @returns Updated cart summary
 */
export async function PATCH(
  request: NextRequest
): Promise<NextResponse<CartResponse | unknown>> {
  try {
    // Step 1: Validate session
    const user = await validateServerSession();

    // Step 2: Validate request body
    const body = await request.json();
    const validatedDto = updateCartItemSchema.parse(body);

    // Step 3: Update cart item
    const cartSummary = await cartService.updateCartItem({
      userId: user.id,
      dto: validatedDto,
    });

    return NextResponse.json(
      {
        success: true,
        data: cartSummary,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/cart
 * Removes an item from the cart.
 *
 * Request Body:
 * - cartItemId: UUID of the cart item to remove
 *
 * @param request - The incoming request
 * @returns Updated cart summary with success message
 */
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<DeleteCartItemResponse | unknown>> {
  try {
    // Step 1: Validate session
    const user = await validateServerSession();

    // Step 2: Validate request body
    const body = await request.json();
    const validatedDto = removeCartItemSchema.parse(body);

    // Step 3: Remove item from cart
    const cartSummary = await cartService.removeCartItem({
      userId: user.id,
      dto: validatedDto,
    });

    return NextResponse.json(
      {
        success: true,
        data: cartSummary,
        message: "Item removed from cart successfully.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
