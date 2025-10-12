import { drizzleDbClient } from "@/database/index";
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

/**
 * Service class for cart operations.
 * Handles all business logic for cart management using DrizzleORM.
 */
export class CartService {
  private readonly db = drizzleDbClient();

  /**
   * Gets or creates a cart for a user.
   * @param userId - The user's ID
   * @returns The cart ID
   */
  public async getOrCreateCart({
    userId,
  }: Readonly<{
    userId: string;
  }>): Promise<string> {
    const [existingCart] = await this.db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId));

    if (existingCart) {
      return existingCart.id;
    }

    const [newCart] = await this.db
      .insert(carts)
      .values({ userId })
      .returning();

    if (!newCart) {
      throw new Error("Failed to create cart");
    }

    return newCart.id;
  }

  /**
   * Gets the full cart with all items and product details.
   * @param userId - The user's ID
   * @returns Cart summary with items
   */
  public async getCart({
    userId,
  }: Readonly<{ userId: string }>): Promise<CartSummary> {
    const cartId = await this.getOrCreateCart({ userId });

    const cart = await this.db.query.carts.findFirst({
      where: eq(carts.id, cartId),
      with: {
        items: {
          with: {
            productVariant: {
              with: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new CartNotFoundError();
    }

    return this.formatCartSummary({ cart: cart as CartWithItems });
  }

  /**
   * Adds an item to the cart or updates quantity if it already exists.
   * @param userId - The user's ID
   * @param dto - Add item DTO
   * @returns Updated cart summary
   */
  public async addItemToCart({
    userId,
    dto,
  }: Readonly<{
    userId: string;
    dto: AddItemToCartDto;
  }>): Promise<CartSummary> {
    if (dto.quantity <= 0) {
      throw new InvalidQuantityError();
    }

    // Validate product variant exists and is available
    const variant = await this.db.query.productVariants.findFirst({
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
        `Only ${variant.inventoryQuantity} units available.`
      );
    }

    const cartId = await this.getOrCreateCart({ userId });

    // Check if item already exists in cart
    const existingItem = await this.db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.productVariantId, dto.productVariantId)
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
          `Only ${variant.inventoryQuantity} units available. You already have ${existingItem.quantity} in your cart.`
        );
      }

      await this.db
        .update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      await this.db.insert(cartItems).values({
        cartId,
        productVariantId: dto.productVariantId,
        quantity: dto.quantity,
      });
    }

    return this.getCart({ userId });
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
  }: Readonly<{
    userId: string;
    dto: UpdateCartItemDto;
  }>): Promise<CartSummary> {
    if (dto.quantity <= 0) {
      throw new InvalidQuantityError();
    }

    const cartId = await this.getOrCreateCart({ userId });

    // Verify the cart item exists and belongs to the user's cart
    const cartItem = await this.db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.id, dto.cartItemId),
        eq(cartItems.cartId, cartId)
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
        `Only ${cartItem.productVariant.inventoryQuantity} units available.`
      );
    }

    await this.db
      .update(cartItems)
      .set({ quantity: dto.quantity })
      .where(eq(cartItems.id, dto.cartItemId));

    return this.getCart({ userId });
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
  }: Readonly<{
    userId: string;
    dto: RemoveCartItemDto;
  }>): Promise<CartSummary> {
    const cartId = await this.getOrCreateCart({ userId });

    // Verify the cart item exists and belongs to the user's cart
    const cartItem = await this.db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.id, dto.cartItemId),
        eq(cartItems.cartId, cartId)
      ),
    });

    if (!cartItem) {
      throw new CartItemNotFoundError();
    }

    await this.db.delete(cartItems).where(eq(cartItems.id, dto.cartItemId));

    return this.getCart({ userId });
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
      0
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
