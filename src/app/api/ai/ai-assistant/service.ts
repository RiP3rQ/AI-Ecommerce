import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { AiAssistantPrompts } from "./prompts";
import { GOOGLE_PROVIDER_OPTIONS, MAX_OUTPUT_TOKENS } from "./constants";
import type { AiAssistantDto } from "./dto";
import { geminiProvider } from "@/ai/gemini-provider";
import { getAiTools } from "@/ai/tools";

/**
 * Service class for AI assistant functionality.
 * Handles streaming AI responses with optional web search capabilities.
 */
export class AiAssistantService {
  /**
   * Generates a streaming AI response based on the conversation messages.
   * @param dto - Validated request parameters
   * @returns Streaming response result for AI conversation
   */
  public async generateStreamingResponse(dto: AiAssistantDto) {
    const { messages } = dto;

    // Generate streaming response
    const result = streamText({
      model: geminiProvider("gemini-2.5-flash"),
      messages: convertToModelMessages(messages),
      system: AiAssistantPrompts.getDefaultSystemPrompt(),
      tools: getAiTools(),
      providerOptions: GOOGLE_PROVIDER_OPTIONS,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      stopWhen: [stepCountIs(10)],
    });

    return result;
  }
}

export const aiAssistantService = new AiAssistantService();
