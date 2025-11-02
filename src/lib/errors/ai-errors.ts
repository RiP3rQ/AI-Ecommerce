import { ApiError } from "./api-error";

/**
 * Thrown when a user exceeds their AI usage limit.
 */
export class AiUsageLimitExceededError extends ApiError {
  constructor(message: string = "AI usage limit exceeded.") {
    super(message, 429); // 429 Too Many Requests
  }
}
