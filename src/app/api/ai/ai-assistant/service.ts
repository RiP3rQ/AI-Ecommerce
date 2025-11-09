import { convertToModelMessages, stepCountIs, streamText, TextPart } from "ai";
import { AiAssistantPrompts } from "./prompts";
import { GOOGLE_PROVIDER_OPTIONS, MAX_OUTPUT_TOKENS } from "./constants";
import { getAiTools } from "@/ai/tools";
import { User } from "@supabase/supabase-js";
import { BodyType } from "./types";
import type { DrizzleDbClient } from "@/database";
import type { TestDatabase } from "@/test/utils/db-helper";
import { geminiProvider } from "@/ai/gemini-provider";
import { AiSdkHandler } from "@/ai/ai-sdk";
import { GEMINI_MODEL_NAME } from "@/ai/constants";
import { GenerateTextResultType } from "@/ai/types";

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
    const startTime = Date.now();

    // Generate streaming response
    const result = streamText({
      model: geminiProvider("gemini-2.5-flash"),
      messages: convertToModelMessages(messages),
      system: AiAssistantPrompts.getDefaultSystemPrompt(),
      tools: getAiTools(),
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
      onFinish: async (event) => {
        console.log("[AI-Assistant] Request finished");
        const result = {
          text: event.text,
          usage: event.usage,
          reasoning: event.reasoningText
            ? [{ type: "reasoning", text: event.reasoningText }]
            : [],
          toolCalls: event.toolCalls,
          toolResults: event.toolResults,
          providerMetadata: event.providerMetadata,
        } satisfies GenerateTextResultType;
        const userLatestMessage = convertToModelMessages(messages)
          .filter((message) => message.role === "user")
          .at(-1);
        let userPrompt = "EMPTY";
        if (userLatestMessage) {
          userPrompt = Array.isArray(userLatestMessage.content)
            ? userLatestMessage.content
                .map((part) => (part as TextPart).text ?? "")
                .join("")
            : userLatestMessage.content.toString();
        }
        await AiSdkHandler.saveAiResultToDatabase({
          result: result,
          dbClient: db,
          operationType: "ai-assistant",
          operationId: userId,
          systemPrompt: AiAssistantPrompts.getDefaultSystemPrompt(),
          userPrompt: userPrompt,
          modelName: GEMINI_MODEL_NAME,
          temperature: 0.1,
          processingTimeMs: Date.now() - startTime,
        });
      },
    });

    return result;
  }
}

export const aiAssistantService = new AiAssistantService();
