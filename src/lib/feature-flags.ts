/**
 * Feature flags for controlling AI-powered features.
 * Set to false to disable features, true to enable them.
 */
export const featureFlags = {
  /** Enable AI-powered product suggestions based on cart items */
  aiProductSuggestions: true,

  /** Enable AI-powered review summarization */
  aiSummarizeReviews: true,

  /** Enable asking questions about reviews using AI */
  aiAskReviews: true,
} as const;

/**
 * Type for feature flag keys
 */
export type FeatureFlag = keyof typeof featureFlags;

/**
 * Check if a feature flag is enabled
 */
export const isFeatureEnabled = (flag: FeatureFlag): boolean => {
  return featureFlags[flag];
};
