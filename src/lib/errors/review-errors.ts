import { ApiError } from "./api-error";

/**
 * Thrown when a user tries to create a review for a product they have already reviewed.
 */
export class ReviewAlreadyExistsError extends ApiError {
  constructor(message: string = "You have already reviewed this product.") {
    super(message, 409);
  }
}
