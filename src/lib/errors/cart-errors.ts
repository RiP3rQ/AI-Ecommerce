import { ApiError } from "./api-error";

/**
 * Thrown when a cart is not found for a user or cart ID.
 */
export class CartNotFoundError extends ApiError {
  constructor(message: string = "Cart not found.") {
    super(message, 404);
  }
}

/**
 * Thrown when a cart item is not found.
 */
export class CartItemNotFoundError extends ApiError {
  constructor(message: string = "Cart item not found.") {
    super(message, 404);
  }
}

/**
 * Thrown when a product variant is not found or unavailable.
 */
export class ProductVariantNotFoundError extends ApiError {
  constructor(message: string = "Product variant not found or unavailable.") {
    super(message, 404);
  }
}

/**
 * Thrown when a product variant has insufficient inventory.
 */
export class InsufficientInventoryError extends ApiError {
  constructor(
    message: string = "Insufficient inventory for the requested quantity.",
  ) {
    super(message, 400);
  }
}

/**
 * Thrown when trying to add an invalid quantity to cart.
 */
export class InvalidQuantityError extends ApiError {
  constructor(
    message: string = "Invalid quantity. Quantity must be greater than 0.",
  ) {
    super(message, 400);
  }
}

/**
 * Thrown when trying to checkout with an empty cart.
 */
export class EmptyCartError extends ApiError {
  constructor(message: string = "Cannot checkout with an empty cart.") {
    super(message, 400);
  }
}

/**
 * Thrown when user is not authenticated.
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = "User is not authenticated.") {
    super(message, 401);
  }
}
