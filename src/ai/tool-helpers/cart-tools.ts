import { drizzleDbClient } from "@/database";
import { carts, cartItems, productVariants, products } from "@/database/schema";
import { eq, and } from "drizzle-orm";

/**
 * Gets detailed cart information for a user including all cart items with product details.
 */
export async function getCartDetails(userId: string): Promise<{
  id: string;
  userId: string;
  items: Array<{
    id: string;
    quantity: number;
    productVariant: {
      id: string;
      title: string;
      price: number;
      currencyCode: string;
      availableForSale: boolean;
      selectedOptions: { name: string; value: string }[];
      product: {
        id: string;
        title: string;
        description?: string | null;
        tags: string[] | null;
      };
    };
  }>;
  itemCount: number;
  totalItems: number;
} | null> {
  const db = drizzleDbClient();

  // Get cart with items and product details
  const cartData = await db
    .select({
      cartId: carts.id,
      cartUserId: carts.userId,
      itemId: cartItems.id,
      itemQuantity: cartItems.quantity,
      variantId: cartItems.productVariantId,
      variantTitle: productVariants.title,
      variantPrice: productVariants.price,
      variantCurrencyCode: productVariants.currencyCode,
      variantAvailableForSale: productVariants.availableForSale,
      variantSelectedOptions: productVariants.selectedOptions,
      productId: productVariants.productId,
      productTitle: products.title,
      productDescription: products.description,
      productTags: products.tags,
    })
    .from(carts)
    .innerJoin(cartItems, eq(carts.id, cartItems.cartId))
    .innerJoin(
      productVariants,
      eq(cartItems.productVariantId, productVariants.id),
    )
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(eq(carts.userId, userId));

  if (cartData.length === 0) {
    return null;
  }

  const cartId = cartData[0].cartId;
  const cartUserId = cartData[0].cartUserId;

  // Group items by cart
  const items = cartData.map((item) => ({
    id: item.itemId,
    quantity: item.itemQuantity,
    productVariant: {
      id: item.variantId,
      title: item.variantTitle,
      price: item.variantPrice,
      currencyCode: item.variantCurrencyCode,
      availableForSale: item.variantAvailableForSale,
      selectedOptions: item.variantSelectedOptions,
      product: {
        id: item.productId,
        title: item.productTitle,
        description: item.productDescription,
        tags: item.productTags,
      },
    },
  }));

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cartId,
    userId: cartUserId,
    items,
    itemCount: items.length,
    totalItems,
  };
}

/**
 * Adds an item to the user's cart. Creates a cart if one doesn't exist.
 */
export async function addToCart(
  userId: string,
  productVariantId: string,
  quantity: number = 1,
): Promise<{
  success: boolean;
  cartId: string;
  cartItemId: string;
  message: string;
}> {
  const db = drizzleDbClient();

  try {
    // First, ensure the user has a cart
    let cartId: string;

    const existingCart = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    if (existingCart.length > 0) {
      cartId = existingCart[0].id;
    } else {
      // Create a new cart for the user
      const newCart = await db
        .insert(carts)
        .values({
          userId,
          updatedAt: new Date(),
        })
        .returning({ id: carts.id });

      cartId = newCart[0].id;
    }

    // Check if this variant is already in the cart
    const existingCartItem = await db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
      })
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cartId),
          eq(cartItems.productVariantId, productVariantId),
        ),
      )
      .limit(1);

    if (existingCartItem.length > 0) {
      // Update quantity if item already exists
      const newQuantity = existingCartItem[0].quantity + quantity;
      await db
        .update(cartItems)
        .set({ quantity: newQuantity, updatedAt: new Date() })
        .where(eq(cartItems.id, existingCartItem[0].id));

      return {
        success: true,
        cartId,
        cartItemId: existingCartItem[0].id,
        message: `Updated cart item quantity to ${newQuantity}`,
      };
    } else {
      // Add new item to cart
      const newCartItem = await db
        .insert(cartItems)
        .values({
          cartId,
          productVariantId,
          quantity,
          updatedAt: new Date(),
        })
        .returning({ id: cartItems.id });

      return {
        success: true,
        cartId,
        cartItemId: newCartItem[0].id,
        message: `Added ${quantity} item(s) to cart`,
      };
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return {
      success: false,
      cartId: "",
      cartItemId: "",
      message: "Failed to add item to cart",
    };
  }
}

/**
 * Removes items from the user's cart by product IDs and quantities.
 */
export async function removeFromCart(
  userId: string,
  productIds: string[],
  quantities: number[],
): Promise<{
  success: boolean;
  itemsProcessed: number;
  results: Array<{
    productId: string;
    removedQuantity: number;
    success: boolean;
    message: string;
  }>;
  message: string;
}> {
  // Get current cart details
  const cartDetails = await getCartDetails(userId);

  if (!cartDetails) {
    throw new Error("No cart found for this user");
  }

  if (!cartDetails.items || cartDetails.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Find cart items that match the product IDs
  const itemsToRemove: Array<{
    cartItemId: string;
    productId: string;
    quantity: number;
    currentQuantity: number;
  }> = [];

  for (let i = 0; i < productIds.length; i++) {
    const productId = productIds[i];
    const requestedQuantity = quantities[i] || 1;

    // Find cart items with this product ID
    const matchingItems = cartDetails.items.filter(
      (item) => item.productVariant.product.id === productId
    );

    if (matchingItems.length === 0) {
      continue; // Skip if product not found in cart
    }

    // For simplicity, we'll remove from the first matching item
    // In a real scenario, you might want to handle multiple variants
    const cartItem = matchingItems[0];
    const currentQuantity = cartItem.quantity;

    itemsToRemove.push({
      cartItemId: cartItem.id,
      productId,
      quantity: Math.min(requestedQuantity, currentQuantity), // Don't remove more than available
      currentQuantity,
    });
  }

  if (itemsToRemove.length === 0) {
    throw new Error("No matching products found in cart");
  }

  // Remove items from cart
  const results = [];
  for (const item of itemsToRemove) {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId: item.cartItemId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to remove item: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      results.push({
        productId: item.productId,
        removedQuantity: item.quantity,
        success: true,
        message: result.message,
      });
    } catch (error) {
      results.push({
        productId: item.productId,
        removedQuantity: 0,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    success: results.some(r => r.success),
    itemsProcessed: itemsToRemove.length,
    results,
    message: `Attempted to remove ${itemsToRemove.length} item(s) from cart`,
  };
}
