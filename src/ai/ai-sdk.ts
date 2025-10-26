import { generateText } from "ai";
import { geminiProvider } from "./gemini-provider";
import {
  GEMINI_MODEL_NAME,
  GEMINI_MODEL_TEMPERATURE,
  GEMINI_MODEL_MAX_OUTPUT_TOKENS,
} from "./constants";
import type { GenerateTextOptions, GenerateTextResultType } from "./types";
import { getAiTools } from "./tools";
import type { DrizzleDbClient } from "@/database";
import type { TestDatabase } from "@/test/utils/db-helper";
import { aiData } from "@/database/schemas/ai-data";

export class AiSdkHandler {
  public static async generateText(
    options: GenerateTextOptions,
    saveToDatabase?: {
      dbClient: DrizzleDbClient | TestDatabase;
      operationType: string;
      operationId?: string;
    },
  ): Promise<GenerateTextResultType> {
    const startTime = Date.now();

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
        tools: options.tools ?? getAiTools(),
      });

      const resultData = {
        text: result.text,
        usage: result.usage,
        reasoning: result.reasoning,
        toolCalls: result.toolCalls,
        toolResults: result.toolResults,
        providerMetadata: result.providerMetadata,
      };

      // Optionally save to database for analysis/debugging
      if (saveToDatabase) {
        const processingTimeMs = Date.now() - startTime;
        await AiSdkHandler.saveAiResultToDatabase({
          result: resultData,
          dbClient: saveToDatabase.dbClient,
          operationType: saveToDatabase.operationType,
          operationId: saveToDatabase.operationId,
          systemPrompt: options.system,
          userPrompt:
            typeof options.prompt === "string" ? options.prompt : undefined,
          modelName: GEMINI_MODEL_NAME,
          temperature: options.temperature ?? GEMINI_MODEL_TEMPERATURE,
          processingTimeMs,
        });
      }

      return resultData;
    } catch (error) {
      // Optionally save error information to database
      if (saveToDatabase) {
        const processingTimeMs = Date.now() - startTime;
        try {
          await saveToDatabase.dbClient.insert(aiData).values({
            operationType: saveToDatabase.operationType,
            operationId: saveToDatabase.operationId
              ? saveToDatabase.operationId
              : undefined,
            systemPrompt: options.system,
            userPrompt:
              typeof options.prompt === "string" ? options.prompt : undefined,
            modelName: GEMINI_MODEL_NAME,
            temperature: options.temperature
              ? Math.round(options.temperature * 100)
              : Math.round(GEMINI_MODEL_TEMPERATURE * 100),
            generatedText: "", // Empty for failed requests
            success: false,
            errorMessage:
              error instanceof Error ? error.message : "Unknown error",
            processingTimeMs,
          });
        } catch (saveError) {
          console.error("Failed to save AI error to database:", saveError);
        }
      }

      // Wrap errors with more context
      throw new Error(
        `AI SDK generateText failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  public static async saveAiResultToDatabase({
    result,
    dbClient,
    operationType,
    operationId,
    systemPrompt,
    userPrompt,
    modelName,
    temperature,
    processingTimeMs,
  }: Readonly<{
    result: GenerateTextResultType;
    dbClient: DrizzleDbClient | TestDatabase;
    operationType: string;
    operationId?: string;
    systemPrompt?: string;
    userPrompt?: string;
    modelName?: string;
    temperature?: number;
    processingTimeMs?: number;
  }>) {
    try {
      const {
        text,
        usage,
        reasoning,
        toolCalls,
        toolResults,
        providerMetadata,
      } = result;

      if (!text || !usage) {
        throw new Error("text and usage are required");
      }

      await dbClient.insert(aiData).values({
        operationType,
        operationId: operationId ? operationId : undefined,
        systemPrompt,
        userPrompt,
        modelName,
        temperature: temperature ? Math.round(temperature * 100) : undefined, // Store as integer
        generatedText: text,
        promptTokens: usage.inputTokens,
        completionTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
        reasoning: reasoning.length > 0 ? reasoning : undefined,
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
        toolResults: toolResults.length > 0 ? toolResults : undefined,
        providerMetadata,
        processingTimeMs,
        success: true,
      });
    } catch (error) {
      // Try to save error information if the main save failed
      try {
        await dbClient.insert(aiData).values({
          operationType,
          operationId: operationId ? operationId : undefined,
          systemPrompt,
          userPrompt,
          modelName,
          temperature: temperature ? Math.round(temperature * 100) : undefined,
          generatedText: result?.text || "",
          promptTokens: result?.usage
            ? (result.usage as any).promptTokens
            : undefined,
          completionTokens: result?.usage
            ? (result.usage as any).completionTokens
            : undefined,
          totalTokens: result?.usage
            ? (result.usage as any).totalTokens
            : undefined,
          success: false,
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          processingTimeMs,
        });
        // If fallback save succeeds, don't throw - we've saved what we can
        return;
      } catch (saveError) {
        // If even the error save fails, log and rethrow the original error
        console.error("Failed to save AI error to database:", saveError);
        throw new Error(
          `AI SDK saveAiResultToDatabase failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }
  }
}
