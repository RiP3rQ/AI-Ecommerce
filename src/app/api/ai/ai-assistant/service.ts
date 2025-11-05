import { streamText, convertToModelMessages } from "ai";
import { AiAssistantPrompts } from "./prompts";
import { GOOGLE_PROVIDER_OPTIONS } from "./constants";
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

    // Transform messages to ensure proper parts structure
    const transformedMessages = messages.map((message) => ({
      ...message,
      parts:
        message.parts.length > 0
          ? message.parts
          : [{ type: "text" as const, text: message.content }],
    }));

    // Generate streaming response
    const result = streamText({
      model: geminiProvider("gemini-2.5-flash"),
      messages: convertToModelMessages(transformedMessages),
      system: AiAssistantPrompts.getDefaultSystemPrompt(),
      tools: getAiTools(),
      providerOptions: GOOGLE_PROVIDER_OPTIONS,
    });

    return result;
  }
}

export const aiAssistantService = new AiAssistantService();
