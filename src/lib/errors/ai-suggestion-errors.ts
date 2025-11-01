import { ApiError } from "./api-error";

/**
 * Thrown when the AI fails to generate product suggestions.
 */
export class AiSuggestionGenerationError extends ApiError {
  constructor(message: string = "Failed to generate product suggestions. Please try again.") {
    super(message, 500);
  }
}

/**
 * Thrown when the AI response cannot be parsed or contains invalid data.
 */
export class AiSuggestionParsingError extends ApiError {
  constructor(message: string = "Unable to process AI suggestions. Please try again.") {
    super(message, 500);
  }
}

/**
 * Thrown when no valid product suggestions can be extracted from the AI response.
 */
export class NoValidSuggestionsError extends ApiError {
  constructor(message: string = "No valid product suggestions could be generated.") {
    super(message, 404);
  }
}

/**
 * Thrown when some suggested products cannot be found in the database.
 */
export class SuggestedProductsNotFoundError extends ApiError {
  constructor(missingProductIds: string[]) {
    super(
      `Some suggested products could not be found: ${missingProductIds.join(", ")}`,
      404
    );
  }
}
