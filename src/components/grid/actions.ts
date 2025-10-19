"use server";

import { drizzleDbClient } from "@/database";
import { createServerSupabaseClient } from "@/supabase-auth/server";
import {
  productImages,
  products,
  productVariants,
  SelectProduct,
  SelectProductImage,
  SelectProductVariant,
} from "@/database/schema";
import { and, desc, eq } from "drizzle-orm";
import { getErrorMessage } from "@/lib/utils";

export type Latest3ProductsReturnType = {
  products: SelectProduct;
  product_images: SelectProductImage | null;
  product_variants: SelectProductVariant | null;
};

export async function getLatest3Products(): Promise<
  Latest3ProductsReturnType[]
> {
  try {
    // Step 0: Validate session
    const supabaseServer = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    if (!user) {
      throw new Error("User is not authenticated");
    }

    // Step 1: Get latest 3 products with main image (order = 1)
    const latest3Products = await drizzleDbClient()
      .select()
      .from(products)
      .leftJoin(
        productImages,
        and(
          eq(products.id, productImages.productId),
          eq(productImages.order, 1),
        ),
      )
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .orderBy(desc(products.createdAt))
      .limit(3);

    if (!latest3Products) {
      throw new Error("Latest 3 products not found");
    }

    return latest3Products;
  } catch (error: unknown) {
    console.error(`[ERROR] Failed to get latest 3 products:`, error);
    throw new Error(getErrorMessage(error));
  }
}
