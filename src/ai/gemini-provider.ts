import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProviderSettings,
} from "@ai-sdk/google";
import { env } from "@/env";
import { GEMINI_API_TIMEOUT } from "./constants";

/**
 * Gemini LLM API fetcher with timeout handling and external abort signal support.
 */
const geminiLlmApiFetcher = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(
    () => timeoutController.abort(),
    GEMINI_API_TIMEOUT,
  );

  // Handle external abort signal if provided
  const externalSignal = init?.signal;
  let combinedController: AbortController | undefined;
  let abortCombined: (() => void) | undefined;

  if (externalSignal) {
    // If both external signal and our timeout exist, combine them
    combinedController = new AbortController();

    // Abort our combined controller when either external signal or timeout triggers
    abortCombined = () => combinedController!.abort();

    externalSignal.addEventListener("abort", abortCombined);
    timeoutController.signal.addEventListener("abort", abortCombined);

    // If external signal is already aborted, abort immediately
    if (externalSignal.aborted) {
      combinedController.abort();
    }
  }

  const signalToUse = combinedController?.signal ?? timeoutController.signal;

  try {
    const response = await fetch(input, {
      ...init,
      signal: signalToUse,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      // Determine if it was our timeout or external abort
      if (timeoutController.signal.aborted && !externalSignal?.aborted) {
        throw new Error(
          `Gemini API request timed out after ${GEMINI_API_TIMEOUT / 1000} seconds`,
        );
      }
      // If external signal aborted or both aborted, re-throw as AbortError
      throw error;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
    // Clean up event listeners if we created combined controller
    if (combinedController && externalSignal && abortCombined) {
      externalSignal.removeEventListener("abort", abortCombined);
      timeoutController.signal.removeEventListener("abort", abortCombined);
    }
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
