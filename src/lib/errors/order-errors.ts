import { ApiError } from "./api-error";

/**
 * Thrown when an order is not found.
 */
export class OrderNotFoundError extends ApiError {
  constructor(message: string = "Order not found.") {
    super(message, 404);
  }
}
