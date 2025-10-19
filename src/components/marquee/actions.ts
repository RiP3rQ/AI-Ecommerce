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

export type Latest20ProductsReturnType = {
  products: SelectProduct;
  product_images: SelectProductImage | null;
  product_variants: SelectProductVariant | null;
};

export async function getLatest20Products(): Promise<
  Latest20ProductsReturnType[]
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

    // Step 1: Get latest 20 products with main image (order = 1)
    const latest20Products = await drizzleDbClient()
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
      .limit(20);

    if (!latest20Products) {
      throw new Error("Latest 20 products not found");
    }

    return latest20Products;
  } catch (error: unknown) {
    console.error(`[ERROR] Failed to get latest 20 products:`, error);
    throw new Error(getErrorMessage(error));
  }
}
