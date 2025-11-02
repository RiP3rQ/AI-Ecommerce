/**
 * Minimum similarity score required for a review to be considered relevant.
 * Lower values include more reviews but may reduce answer quality.
 */
export const MIN_SIMILARITY_THRESHOLD = 0.3;

/**
 * Maximum number of reviews to include in the answer generation context.
 */
export const MAX_REVIEWS_FOR_CONTEXT = 10;

/**
 * Maximum output tokens for the answer generation.
 */
export const MAX_ANSWER_TOKENS = 800;

/**
 * Minimum number of relevant reviews required for a confident answer.
 */
export const MIN_REVIEWS_FOR_HIGH_CONFIDENCE = 3;

/**
 * Similarity threshold for high confidence answers.
 */
export const HIGH_CONFIDENCE_THRESHOLD = 0.6;
