import type { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";

/**
 * Default model used for AI assistant responses.
 */
export const AI_ASSISTANT_MODEL = "gemini-2.5-flash";

/**
 * Maximum output tokens for the AI assistant responses.
 */
export const MAX_ASSISTANT_OUTPUT_TOKENS = 64000;

/**
 * Google provider options.
 */
export const GOOGLE_PROVIDER_OPTIONS = {
  google: {
    // Enable structured outputs (default: true, but explicit for clarity)
    structuredOutputs: true,
    // Configure safety settings for all harm categories
    safetySettings: [
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_LOW_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_LOW_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_LOW_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_LOW_AND_ABOVE",
      },
    ],
    // Enable thinking for improved reasoning (supported by gemini-2.5-flash)
    thinkingConfig: {
      thinkingBudget: 8192, // Token budget for thinking process
      includeThoughts: true, // Set to true if you want reasoning summaries
    },
    // Response modalities (default to TEXT only)
    responseModalities: ["TEXT"],
  } satisfies GoogleGenerativeAIProviderOptions,
};
