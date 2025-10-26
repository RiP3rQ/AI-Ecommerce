import { type DrizzleDbClient, drizzleDbClient } from "@/database/index";
import { carts, cartItems } from "@/database/schemas/cart";
import { productVariants } from "@/database/schemas/product-variants";
import { eq, and } from "drizzle-orm";
import {
  CartNotFoundError,
  CartItemNotFoundError,
  ProductVariantNotFoundError,
  InsufficientInventoryError,
  InvalidQuantityError,
} from "@/lib/errors";
import type {
  AddItemToCartDto,
  UpdateCartItemDto,
  RemoveCartItemDto,
} from "./dto";
import type { CartSummary, CartWithItems, CartItemWithDetails } from "./types";
import type { SelectProductImage } from "@/database/schemas/product-images";
import type { TestDatabase } from "@/test/utils/db-helper";

/**
 * Service class for cart operations.
 * Handles all business logic for cart management using DrizzleORM.
 */
export class CartService {
  /**
   * Gets or creates a cart for a user.
   * @param userId - The user's ID
   * @param db - Optional database connection (for testing)
   * @returns The cart ID
   */
  public async getOrCreateCart({
    userId,
    db,
  }: Readonly<{
    userId: string;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<string> {
    const [existingCart] = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId));

    if (existingCart) {
      return existingCart.id;
    }

    const [newCart] = await db.insert(carts).values({ userId }).returning();

    if (!newCart) {
      throw new Error("Failed to create cart");
    }

    return newCart.id;
  }

  /**
   * Gets the full cart with all items and product details.
   * @param userId - The user's ID
   * @param db - Optional database connection (for testing)
   * @returns Cart summary with items
   */
  public async getCart({
    userId,
    db,
  }: Readonly<{
    userId: string;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<CartSummary> {
    const cartId = await this.getOrCreateCart({ userId, db });

    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
      with: {
        items: {
          with: {
            productVariant: {
              with: {
                product: {
                  with: {
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new CartNotFoundError();
    }

    // Add featured image to each cart item
    const cartWithFeaturedImages = {
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        featuredImage: this.getFeaturedImage(
          item.productVariant.product.images,
        ),
      })),
    };

    return this.formatCartSummary({
      cart: cartWithFeaturedImages as CartWithItems,
    });
  }

  /**
   * Adds an item to the cart or updates quantity if it already exists.
   * @param userId - The user's ID
   * @param dto - Add item DTO
   * @param db - Optional database connection (for testing)
   * @returns Updated cart summary
   */
  public async addItemToCart({
    userId,
    dto,
    db,
  }: Readonly<{
    userId: string;
    dto: AddItemToCartDto;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<CartSummary> {
    if (dto.quantity <= 0) {
      throw new InvalidQuantityError();
    }

    // Validate product variant exists and is available
    const variant = await db.query.productVariants.findFirst({
      where: eq(productVariants.id, dto.productVariantId),
      with: {
        product: true,
      },
    });

    if (!variant || !variant.availableForSale) {
      throw new ProductVariantNotFoundError();
    }

    // Check inventory if tracked
    if (
      variant.inventoryQuantity !== null &&
      variant.inventoryQuantity < dto.quantity
    ) {
      throw new InsufficientInventoryError(
        `Only ${variant.inventoryQuantity} units available.`,
      );
    }

    const cartId = await this.getOrCreateCart({ userId, db });

    // Check if item already exists in cart
    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.productVariantId, dto.productVariantId),
      ),
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;

      // Check inventory for new total quantity
      if (
        variant.inventoryQuantity !== null &&
        variant.inventoryQuantity < newQuantity
      ) {
        throw new InsufficientInventoryError(
          `Only ${variant.inventoryQuantity} units available. You already have ${existingItem.quantity} in your cart.`,
        );
      }

      await db
        .update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      await db.insert(cartItems).values({
        cartId,
        productVariantId: dto.productVariantId,
        quantity: dto.quantity,
      });
    }

    return this.getCart({ userId, db });
  }

  /**
   * Updates the quantity of a cart item.
   * @param userId - The user's ID
   * @param dto - Update cart item DTO
   * @returns Updated cart summary
   */
  public async updateCartItem({
    userId,
    dto,
    db,
  }: Readonly<{
    userId: string;
    dto: UpdateCartItemDto;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<CartSummary> {
    if (dto.quantity <= 0) {
      throw new InvalidQuantityError();
    }

    const cartId = await this.getOrCreateCart({ userId, db });

    // Verify the cart item exists and belongs to the user's cart
    const cartItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.id, dto.cartItemId),
        eq(cartItems.cartId, cartId),
      ),
      with: {
        productVariant: true,
      },
    });

    if (!cartItem) {
      throw new CartItemNotFoundError();
    }

    // Check inventory if tracked
    if (
      cartItem.productVariant.inventoryQuantity !== null &&
      cartItem.productVariant.inventoryQuantity < dto.quantity
    ) {
      throw new InsufficientInventoryError(
        `Only ${cartItem.productVariant.inventoryQuantity} units available.`,
      );
    }

    await db
      .update(cartItems)
      .set({ quantity: dto.quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, dto.cartItemId));

    return this.getCart({ userId, db });
  }

  /**
   * Removes an item from the cart.
   * @param userId - The user's ID
   * @param dto - Remove cart item DTO
   * @returns Updated cart summary
   */
  public async removeCartItem({
    userId,
    dto,
    db,
  }: Readonly<{
    userId: string;
    dto: RemoveCartItemDto;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<CartSummary> {
    const cartId = await this.getOrCreateCart({ userId, db });

    // Verify the cart item exists and belongs to the user's cart
    const cartItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.id, dto.cartItemId),
        eq(cartItems.cartId, cartId),
      ),
    });

    if (!cartItem) {
      throw new CartItemNotFoundError();
    }

    await db.delete(cartItems).where(eq(cartItems.id, dto.cartItemId));

    return this.getCart({ userId, db });
  }

  /**
   * Gets the featured image from a list of product images.
   * The featured image is the one with the lowest order value.
   * @param images - Array of product images
   * @returns Featured image or null if no images exist
   */
  private getFeaturedImage(
    images: readonly SelectProductImage[],
  ): SelectProductImage | null {
    if (!images || images.length === 0) {
      return null;
    }

    return images.reduce((featured, current) =>
      current.order < featured.order ? current : featured,
    );
  }

  /**
   * Clears all items from a user's cart.
   * @param userId - The user's ID
   * @param db - Optional database connection (for testing)
   */
  public async clearCart({
    userId,
    db,
  }: Readonly<{
    userId: string;
    db: DrizzleDbClient | TestDatabase;
  }>): Promise<void> {
    const cartId = await this.getOrCreateCart({ userId, db });

    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
  }

  /**
   * Formats a cart with items into a cart summary.
   * @param cart - Cart with items
   * @returns Cart summary
   */
  private formatCartSummary({
    cart,
  }: Readonly<{
    cart: CartWithItems;
  }>): CartSummary {
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.productVariant.price * item.quantity,
      0,
    );

    const currencyCode =
      cart.items.length > 0 ? cart.items[0].productVariant.currencyCode : "USD";

    return {
      cart,
      totalItems,
      totalPrice,
      currencyCode,
    };
  }
}

export const cartService = new CartService();
