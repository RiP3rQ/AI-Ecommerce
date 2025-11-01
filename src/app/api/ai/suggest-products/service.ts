import { streamText, stepCountIs } from "ai";
import { geminiProvider } from "@/ai/gemini-provider";
import { getAiTools } from "@/ai/tools";
import type { SuggestProductsDto } from "./dto";
import { SuggestProductsPrompts } from "./prompts";

/**
 * Service class for AI-powered product suggestions using RAG.
 * Uses Retrieval Augmented Generation where the LLM controls the entire process.
 */
export class SuggestProductsService {
  /**
   * Generates product suggestions using RAG (Retrieval Augmented Generation).
   * The LLM has full control over when to use tools and how to process information.
   *
   * @param dto - The suggestion request data
   * @returns Streaming response with AI-generated suggestions
   */
  public async suggestProducts(dto: SuggestProductsDto) {
    const { cartItems, maxSuggestions } = dto;

    const result = streamText({
      model: geminiProvider("gemini-2.5-flash"),
      system: SuggestProductsPrompts.SYSTEM_PROMPT,
      prompt: SuggestProductsPrompts.USER_PROMPT(cartItems, maxSuggestions),
      temperature: 0.3, // Balanced creativity and consistency
      maxOutputTokens: 1000,
      stopWhen: stepCountIs(3), // Limit tool call steps for efficiency
      tools: getAiTools(), // Include all available tools, including suggest_products
    });

    return result;
  }
}

export const suggestProductsService = new SuggestProductsService();
