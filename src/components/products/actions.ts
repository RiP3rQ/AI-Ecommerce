"use server";

import { drizzleDbClient } from "@/database";
import {
  carts,
  cartItems,
  productVariants,
  products,
  productImages,
} from "@/database/schema";
import { TAGS } from "@/lib/constants";
import { SelectCart, SelectCartItem, CartCost } from "@/types/cart";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    // await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    // const cart = await getCart();
    // if (!cart) {
    //   return "Error fetching cart";
    // }
    // const lineItem = cart.lines.find(
    //   (line) => line.merchandise.id === merchandiseId
    // );
    // if (lineItem && lineItem.id) {
    //   await removeFromCart([lineItem.id]);
    //   revalidateTag(TAGS.cart);
    // } else {
    //   return "Item not found in cart";
    // }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    // const cart = await getCart();

    // if (!cart) {
    //   return "Error fetching cart";
    // }

    // const lineItem = cart.lines.find(
    //   (line) => line.merchandise.id === merchandiseId
    // );

    // if (lineItem && lineItem.id) {
    //   if (quantity === 0) {
    //     await removeFromCart([lineItem.id]);
    //   } else {
    //     await updateCart([
    //       {
    //         id: lineItem.id,
    //         merchandiseId,
    //         quantity,
    //       },
    //     ]);
    //   }
    // } else if (quantity > 0) {
    //   // If the item doesn't exist in the cart and quantity > 0, add it
    //   await addToCart([{ merchandiseId, quantity }]);
    // }

    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  //   let cart = await getCart();
  //   redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  //   let cart = await createCart();
  //   (await cookies()).set("cartId", cart.id!);
}

export async function getCart(): Promise<SelectCart | undefined> {
  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    return undefined;
  }

  const db = drizzleDbClient();

  // Fetch cart with all related data
  const [cartData] = await db
    .select({
      cartId: carts.id,
      cartItemId: cartItems.id,
      quantity: cartItems.quantity,
      variantId: productVariants.id,
      variantTitle: productVariants.title,
      variantPrice: productVariants.price,
      variantCurrencyCode: productVariants.currencyCode,
      variantSelectedOptions: productVariants.selectedOptions,
      productId: products.id,
      productTitle: products.title,
      imageUrl: productImages.url,
      imageAltText: productImages.altText,
      imageWidth: productImages.width,
      imageHeight: productImages.height,
    })
    .from(carts)
    .leftJoin(cartItems, eq(cartItems.cartId, carts.id))
    .leftJoin(
      productVariants,
      eq(cartItems.productVariantId, productVariants.id)
    )
    .leftJoin(products, eq(productVariants.productId, products.id))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .where(eq(carts.id, cartId));

  // Old carts become `null` when you checkout
  if (!cartData) {
    return undefined;
  }

  // If cart exists but has no items
  if (!cartData.cartItemId) {
    return {
      id: cartData.cartId,
      checkoutUrl: "",
      totalQuantity: 0,
      lines: [],
      cost: {
        subtotalAmount: { amount: "0", currencyCode: "USD" },
        totalAmount: { amount: "0", currencyCode: "USD" },
        totalTaxAmount: { amount: "0", currencyCode: "USD" },
      } as CartCost,
    };
  }

  // Fetch all items for this cart
  const allCartItems = await db
    .select({
      cartItemId: cartItems.id,
      quantity: cartItems.quantity,
      variantId: productVariants.id,
      variantTitle: productVariants.title,
      variantPrice: productVariants.price,
      variantCurrencyCode: productVariants.currencyCode,
      variantSelectedOptions: productVariants.selectedOptions,
      productId: products.id,
      productTitle: products.title,
      imageUrl: productImages.url,
      imageAltText: productImages.altText,
      imageWidth: productImages.width,
      imageHeight: productImages.height,
    })
    .from(cartItems)
    .innerJoin(
      productVariants,
      eq(cartItems.productVariantId, productVariants.id)
    )
    .innerJoin(products, eq(productVariants.productId, products.id))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .where(eq(cartItems.cartId, cartId));

  // Group items by cart item ID (since images might create multiple rows)
  const itemsMap = new Map<string, (typeof allCartItems)[0]>();
  for (const item of allCartItems) {
    if (!itemsMap.has(item.cartItemId)) {
      itemsMap.set(item.cartItemId, item);
    }
  }

  // Transform to frontend cart item structure
  const lines: SelectCartItem[] = Array.from(itemsMap.values()).map((item) => {
    const itemTotalAmount = (
      (item.variantPrice / 100) *
      item.quantity
    ).toString();

    return {
      id: item.cartItemId,
      quantity: item.quantity,
      cost: {
        totalAmount: {
          amount: itemTotalAmount,
          currencyCode: item.variantCurrencyCode,
        },
      },
      merchandise: {
        id: item.variantId,
        title: item.variantTitle,
        selectedOptions: item.variantSelectedOptions as Array<{
          name: string;
          value: string;
        }>,
        product: {
          id: item.productId,
          handle: item.productId,
          title: item.productTitle,
          featuredImage: item.imageUrl
            ? {
                url: item.imageUrl,
                altText: item.imageAltText ?? undefined,
                width: item.imageWidth ?? undefined,
                height: item.imageHeight ?? undefined,
              }
            : null,
        },
      },
    };
  });

  // Calculate totals
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    id: cartData.cartId,
    checkoutUrl: "",
    totalQuantity,
    lines,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}
