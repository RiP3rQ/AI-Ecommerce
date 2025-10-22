import { generateText } from "ai";
import { geminiProvider } from "./gemini-provider";
import {
  GEMINI_MODEL_NAME,
  GEMINI_MODEL_TEMPERATURE,
  GEMINI_MODEL_MAX_OUTPUT_TOKENS,
} from "./constants";
import { GenerateTextOptions, GenerateTextResultType } from "./types";

export class AiSdkHandler {
  public async generateText(
    options: GenerateTextOptions,
  ): Promise<GenerateTextResultType> {
    try {
      const result = await generateText({
        model: geminiProvider(GEMINI_MODEL_NAME),
        system: options.system,
        prompt: options.prompt,
        temperature: options.temperature ?? GEMINI_MODEL_TEMPERATURE,
        stopWhen: options.stopWhen,
        experimental_context: options.experimental_context,
        maxOutputTokens:
          options.maxOutputTokens ?? GEMINI_MODEL_MAX_OUTPUT_TOKENS,
        tools: options.tools,
      });

      return {
        text: result.text,
        response: result.response,
        usage: result.usage,
        reasoning: result.reasoning,
        toolCalls: result.toolCalls,
        toolResults: result.toolResults,
      };
    } catch (error) {
      // Wrap errors with more context
      throw new Error(
        `AI SDK generateText failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
