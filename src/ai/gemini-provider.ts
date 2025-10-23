import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProviderSettings,
} from "@ai-sdk/google";
import { env } from "@/env";
import { GEMINI_API_TIMEOUT } from "./constants";

/**
 * Gemini LLM API fetcher with timeout handling.
 */
const geminiLlmApiFetcher = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_API_TIMEOUT);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Gemini API request timed out after ${GEMINI_API_TIMEOUT / 1000} seconds`,
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Gemini provider options.
 */
const geminiProviderOptions: GoogleGenerativeAIProviderSettings = {
  apiKey: env.GEMINI_API_KEY,
  fetch: geminiLlmApiFetcher,
};

/**
 * Custom Gemini provider instance.
 */
export const geminiProvider = createGoogleGenerativeAI(geminiProviderOptions);
