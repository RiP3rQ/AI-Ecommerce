import { ApiError } from "./api-error";

/**
 * Thrown when no products are found matching the filter criteria.
 */
export class ProductsNotFoundError extends ApiError {
  constructor(message: string = "No products found matching your criteria.") {
    super(message, 404);
  }
}

/**
 * Thrown when an invalid sort field is provided.
 */
export class InvalidSortFieldError extends ApiError {
  constructor(message: string = "Invalid sort field provided.") {
    super(message, 400);
  }
}

/**
 * Thrown when an invalid price range is provided.
 */
export class InvalidPriceRangeError extends ApiError {
  constructor(
    message: string = "Invalid price range. Minimum price must be less than maximum price.",
  ) {
    super(message, 400);
  }
}

/**
 * Thrown when a category is not found.
 */
export class CategoryNotFoundError extends ApiError {
  constructor(message: string = "Category not found.") {
    super(message, 404);
  }
}

/**
 * Thrown when a product is not found.
 */
export class ProductNotFoundError extends ApiError {
  constructor(message: string = "Product not found.") {
    super(message, 404);
  }
}
