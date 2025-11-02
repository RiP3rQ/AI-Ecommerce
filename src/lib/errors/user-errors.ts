import { ApiError } from "./api-error";

/**
 * Thrown when a user is not found.
 */
export class UserNotFoundError extends ApiError {
  constructor(message: string = "User not found.") {
    super(message, 404);
  }
}
