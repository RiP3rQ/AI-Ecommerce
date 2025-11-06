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
