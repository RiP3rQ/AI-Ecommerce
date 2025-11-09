import { convertToModelMessages, stepCountIs } from "ai";
import { AiSdkHandler } from "@/ai/ai-sdk";
import { AiAssistantPrompts } from "./prompts";
import { GOOGLE_PROVIDER_OPTIONS, MAX_OUTPUT_TOKENS } from "./constants";
import { getAiTools } from "@/ai/tools";
import { User } from "@supabase/supabase-js";
import { BodyType } from "./types";
import type { DrizzleDbClient } from "@/database";
import type { TestDatabase } from "@/test/utils/db-helper";

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
   * @param db - Database client for saving AI results
   * @returns Streaming response result for AI conversation
   */
  public async generateStreamingResponse({
    body,
    userId,
    abortSignal,
    db,
  }: {
    body: BodyType;
    userId: User["id"];
    abortSignal?: AbortSignal;
    db: DrizzleDbClient | TestDatabase;
  }) {
    const { messages } = body;

    // Generate streaming response
    const result = await AiSdkHandler.streamText(
      {
        messages: convertToModelMessages(messages),
        system: AiAssistantPrompts.getDefaultSystemPrompt(),
        tools: getAiTools(),
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        stopWhen: [stepCountIs(10)],
        abortSignal,
        experimental_context: {
          userId: userId,
        },
        providerOptions: GOOGLE_PROVIDER_OPTIONS,
        onAbort: (event) => {
          console.warn("[AI-Assistant] Request aborted");
          console.dir(event, { depth: null });
        },
        onError: (error) => {
          console.error("[AI-Assistant] AI generation error:", error);
        },
      },
      {
        dbClient: db,
        operationType: "ai_assistant",
        operationId: userId,
      },
    );

    return result;
  }
}

export const aiAssistantService = new AiAssistantService();
