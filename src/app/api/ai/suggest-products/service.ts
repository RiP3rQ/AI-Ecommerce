import { generateText, stepCountIs } from "ai";
import { geminiProvider } from "@/ai/gemini-provider";
import { getAiTools } from "@/ai/tools";
import { SuggestProductsPrompts } from "./prompts";
import { CartItemWithDetails } from "../../cart/types";
import { MAX_SUGGESTIONS } from "./constants";
import { productService } from "../../product/[id]/service";
import { ProductData } from "../../product/[id]/types";
import {
  AiSuggestionGenerationError,
  AiSuggestionParsingError,
  NoValidSuggestionsError,
  SuggestedProductsNotFoundError,
} from "@/lib/errors/ai-suggestion-errors";

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
  public async suggestProducts({
    cartItems,
  }: Readonly<{ cartItems: CartItemWithDetails[] }>): Promise<
    Array<{ productId: string; reason: string; productData?: ProductData }>
  > {
    // Step 1: Validate input
    if (!cartItems || cartItems.length === 0) {
      throw new NoValidSuggestionsError(
        "No cart items provided for suggestions",
      );
    }

    // Step 2: Create the cart items text
    const cartItemsText = cartItems
      .map((item) => `${item.quantity}x ${item.productVariant.product.title}`)
      .join(", ");

    // Step 3: Generate the text with tool usage
    let responseText: string = "";

    try {
      console.log("Generating text...");
      const aiResponse = await generateText({
        model: geminiProvider("gemini-2.5-flash"),
        system: SuggestProductsPrompts.SYSTEM_PROMPT,
        prompt: SuggestProductsPrompts.USER_PROMPT({
          cartItemsText,
          maxSuggestions: MAX_SUGGESTIONS,
        }),
        temperature: 0.3, // Balanced creativity and consistency
        maxOutputTokens: 4000, // Increased for tool results and analysis
        stopWhen: [stepCountIs(3)],
        tools: getAiTools(), // Include all available tools, including suggestProducts
      });
      responseText = aiResponse.text || "";
    } catch (error) {
      console.error("AI generation error:", error);
      throw new AiSuggestionGenerationError();
    }

    // Step 5: Extract product suggestions from the AI response or tool results
    const suggestions: Array<{ productId: string; reason: string }> = this.extractSuggestionsFromResponse(responseText);

    console.log("suggestions", suggestions);
    if (suggestions.length === 0) {
      throw new NoValidSuggestionsError();
    }

    // Step 6: Fetch the data for the suggested products
    const suggestedProducts = await productService.getProducts({
      productIds: suggestions.map((suggestion) => suggestion.productId),
    });

    // Step 7: Check for missing products and warn about them
    const foundProductIds = new Set(suggestedProducts.map((p) => p.id));
    const missingProductIds = suggestions
      .map((s) => s.productId)
      .filter((id) => !foundProductIds.has(id));

    if (missingProductIds.length > 0) {
      console.warn(
        `Some suggested products not found in database: ${missingProductIds.join(", ")}`,
      );
      // Continue with available products rather than failing completely
    }

    // Step 8: Build the final response type
    const finalResponse = suggestions
      .filter((suggestion) => foundProductIds.has(suggestion.productId))
      .map((suggestion) => ({
        productId: suggestion.productId,
        reason: suggestion.reason,
        productData: suggestedProducts.find(
          (productData) => productData.id === suggestion.productId,
        ),
      }));

    // If we end up with no valid suggestions after filtering, throw an error
    if (finalResponse.length === 0) {
      throw new SuggestedProductsNotFoundError(missingProductIds);
    }

    return finalResponse;
  }

  /**
   * Extracts product suggestions from AI response text.
   * Parses XML format as specified in the system prompt.
   */
  private extractSuggestionsFromResponse(
    responseText: string,
  ): Array<{ productId: string; reason: string }> {
    const suggestions: Array<{ productId: string; reason: string }> = [];

    try {
      // Parse XML response format as specified in the prompt
      const xmlMatch = responseText.match(
        /<suggestions>[\s\S]*?<\/suggestions>/,
      );
      if (xmlMatch) {
        const xmlContent = xmlMatch[0];

        // Extract individual suggestions using regex
        const suggestionMatches = xmlContent.match(
          /<suggestion>[\s\S]*?<\/suggestion>/g,
        );

        if (suggestionMatches) {
          for (const suggestionXml of suggestionMatches) {
            const productIdMatch = suggestionXml.match(
              /<productId>(.*?)<\/productId>/,
            );
            const reasonMatch = suggestionXml.match(/<reason>(.*?)<\/reason>/);

            if (productIdMatch && reasonMatch) {
              const productId = productIdMatch[1].trim();
              const reason = reasonMatch[1].trim();

              if (productId && reason) {
                suggestions.push({ productId, reason });
              }
            }
          }
        }

        if (suggestions.length > 0) {
          return suggestions.slice(0, MAX_SUGGESTIONS);
        }
      }

      // Fallback: Try to parse as JSON (legacy support)
      const jsonMatch =
        responseText.match(/\[.*\]/g) || responseText.match(/\{.*\}/g);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            for (const item of parsed) {
              if (item.productId && item.reason) {
                suggestions.push({
                  productId: item.productId,
                  reason: item.reason,
                });
              }
            }
          }
          if (suggestions.length > 0) {
            return suggestions.slice(0, MAX_SUGGESTIONS);
          }
        } catch (e) {
          // JSON parsing failed, continue with fallback
        }
      }

      // Final fallback: Look for any UUIDs in the text and create basic suggestions
      const uuidRegex =
        /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi;
      const uuids = responseText.match(uuidRegex);

      if (uuids) {
        for (const uuid of uuids.slice(0, MAX_SUGGESTIONS)) {
          suggestions.push({
            productId: uuid,
            reason:
              "Recommended complementary product based on your cart items",
          });
        }
      }

      return suggestions.slice(0, MAX_SUGGESTIONS);
    } catch (error) {
      console.error("Error parsing AI response:", error);
      throw new AiSuggestionParsingError(
        `Failed to parse AI response: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

export const suggestProductsService = new SuggestProductsService();
