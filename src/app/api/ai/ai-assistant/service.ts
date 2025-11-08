import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { AiAssistantPrompts } from "./prompts";
import { GOOGLE_PROVIDER_OPTIONS, MAX_OUTPUT_TOKENS } from "./constants";
import { geminiProvider } from "@/ai/gemini-provider";
import { getToolsWithoutSuggestProducts } from "@/ai/tools";
import { User } from "@supabase/supabase-js";
import { BodyType } from "./types";

/**
 * Service class for AI assistant functionality.
 * Handles streaming AI responses with optional web search capabilities.
 */
export class AiAssistantService {
  /**
   * Generates a streaming AI response based on the conversation messages.
   * @param body - Messages with the ai-sdk format
   * @param userId - User identifier
   * @param abortSignal - Abort signal for cancelling the request
   * @returns Streaming response result for AI conversation
   */
  public async generateStreamingResponse({
    body,
    userId,
    abortSignal,
  }: {
    body: BodyType;
    userId: User["id"];
    abortSignal?: AbortSignal;
  }) {
    const { messages } = body;

    // Generate streaming response
    const result = streamText({
      model: geminiProvider("gemini-2.5-flash"),
      messages: convertToModelMessages(messages),
      system: AiAssistantPrompts.getDefaultSystemPrompt(),
      tools: getToolsWithoutSuggestProducts(),
      providerOptions: GOOGLE_PROVIDER_OPTIONS,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      stopWhen: [stepCountIs(10)],
      abortSignal,
      experimental_context: {
        userId: userId,
      },
      onAbort: (event) => {
        console.warn("[AI-Assistant] Request aborted");
        console.dir(event, { depth: null });
      },
      onError: (error) => {
        console.error("[AI-Assistant] AI generation error:", error);
      },
    });

    return result;
  }
}

export const aiAssistantService = new AiAssistantService();
