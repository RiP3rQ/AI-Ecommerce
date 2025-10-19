import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { productService } from "./service";
import { getProductSchema } from "./dto";
import type { ProductResponse } from "./types";
import { drizzleDbClient } from "@/database";
import { validateServerSession } from "@/lib/api-helpers";

/**
 * GET /api/product/[productUuid]
 * Retrieves a single product by UUID with all related data.
 *
 * Path Parameters:
 * - productUuid: UUID of the product to retrieve
 *
 * @param request - The incoming request
 * @param context - Route context containing path parameters
 * @returns Product data with variants, images, options, and price range
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ProductResponse | unknown>> {
  try {
    // Step 1: Validate user session
    await validateServerSession();

    // Step 2: Extract and validate path parameters
    const { id } = await params;

    console.log("id", id);

    // Step 3: Validate parameters
    const validatedDto = getProductSchema.parse({ id });

    // Step 4: Get product from service
    const productData = await productService.getProduct({
      dto: validatedDto,
      db: drizzleDbClient(),
    });

    return NextResponse.json(
      {
        success: true,
        data: productData,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
