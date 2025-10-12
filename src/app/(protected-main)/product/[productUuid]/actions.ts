"use server";

import { drizzleDbClient } from "@/database";
import {
  productImages,
  productOptions,
  products,
  productVariants,
  SelectProduct,
  SelectProductImage,
  SelectProductOption,
  SelectProductVariant,
} from "@/database/schema";
import { getErrorMessage } from "@/lib/utils";
import { createServerSupabaseClient } from "@/supabase-auth/server";
import { PriceRange } from "@/types/products";
import { asc, eq } from "drizzle-orm";

export interface GetProductDataReturnType extends SelectProduct {
  product_variants: SelectProductVariant[];
  product_images: SelectProductImage[];
  product_options: SelectProductOption[];
  priceRange: PriceRange;
}

export async function getProductData(
  productUuid: string
): Promise<GetProductDataReturnType> {
  try {
    // Step 1: Validate session
    const supabaseServer = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();
    if (!user) {
      throw new Error("User is not authenticated");
    }

    // Step 2: Get product data
    const productData = await drizzleDbClient()
      .select()
      .from(products)
      .where(eq(products.id, productUuid))
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .leftJoin(productOptions, eq(products.id, productOptions.productId));

    if (!productData || productData.length === 0) {
      throw new Error("Product with uuid " + productUuid + " not found");
    }

    //Step 3: Transform the joined result into the expected format
    const product = productData[0].products;
    const product_variants = productData
      .map((row) => row.product_variants)
      .filter((variant): variant is SelectProductVariant => variant !== null);
    const product_images = productData
      .map((row) => row.product_images)
      .filter((image): image is SelectProductImage => image !== null)
      .sort((a, b) => a.order - b.order);
    const product_options = productData
      .map((row) => row.product_options)
      .filter((option): option is SelectProductOption => option !== null)
      .sort((a, b) => a.position - b.position);

    //Step 4: Calculate the price range
    // Calculate min and max variant price, ensuring the currencyCode matches the min/max value
    let minVariantPrice = {
      amount: Number.POSITIVE_INFINITY,
      currencyCode: "USD",
    };
    let maxVariantPrice = {
      amount: Number.NEGATIVE_INFINITY,
      currencyCode: "USD",
    };

    for (const variant of product_variants) {
      if (variant.price < minVariantPrice.amount) {
        minVariantPrice = {
          amount: variant.price,
          currencyCode: variant.currencyCode,
        };
      }
      if (variant.price > maxVariantPrice.amount) {
        maxVariantPrice = {
          amount: variant.price,
          currencyCode: variant.currencyCode,
        };
      }
    }

    // Handle case where there are no variants
    if (!product_variants.length) {
      minVariantPrice = { amount: 0, currencyCode: "USD" };
      maxVariantPrice = { amount: 0, currencyCode: "USD" };
    }

    // Step 5: Return the product data
    const priceRange = {
      minVariantPrice,
      maxVariantPrice,
    };

    // Step 6: Return the product data
    return {
      ...product,
      product_variants,
      product_images,
      product_options,
      priceRange,
    };
  } catch (error: unknown) {
    console.error(`[ERROR] Failed to get product data:`, error);
    throw new Error(getErrorMessage(error));
  }
}
