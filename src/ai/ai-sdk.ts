import { generateObject, generateText, ModelMessage, NoObjectGeneratedError, StopCondition, ToolSet } from 'ai';
import { z } from 'zod';
import { geminiProvider } from './gemini-provider';
import { GEMINI_MODEL_NAME, GEMINI_MODEL_TEMPERATURE, GEMINI_MODEL_MAX_OUTPUT_TOKENS } from './constants';

/**
 * Result type for generateObject operations.
 */
export interface GenerateObjectResult<T extends z.ZodType> {
    /** The generated structured object that conforms to the provided schema. */
    object: z.infer<T>;
    /** Metadata about the AI provider response including headers, status, etc. */
    response: {
        headers?: Record<string, string>;
        body?: unknown;
    };
    /** Token usage information for the request. */
    usage?: {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
    /** Model's reasoning process (if available). */
    reasoning?: string;
}

/**
 * Configuration options for generateObject operations.
 */
export interface GenerateObjectOptions<T extends z.ZodType> {
    /** The system prompt to send to the AI model. */
    system?: string;
    /** The prompt to send to the AI model. */
    prompt: string | Array<ModelMessage>;
    /** Temperature setting for response creativity (0.0 to 1.0). */
    temperature?: number;
    /** The stop conditions for the generation. */
    stopWhen?: StopCondition<NoInfer<ToolSet>> | StopCondition<NoInfer<ToolSet>>[]
    /** Experimental context for the generation. */
    experimental_context?: unknown;
    /** The maximum number of tokens to generate. */
    maxOutputTokens?: number;
}

export class AiSdkHandler {
    /**
     * Generates structured data using the Gemini AI model.
     * This is the primary public interface for AI-powered structured data generation.
     *
     * @template T - The Zod schema type defining the output structure.
     * @param options - Configuration options for the generation request.
     * @returns Promise resolving to the generated object with metadata.
     * @throws {NoObjectGeneratedError} When the AI model fails to generate valid structured data.
     * @throws {Error} For network errors, timeouts, or other operational issues.
     *
     * @example Basic object generation
     * ```typescript
     * const result = await aiHandler.generateObject({
     *   schema: z.object({ name: z.string(), age: z.number() }),
     *   prompt: "Create a person profile"
     * });
     * ```
     *
     * @example Array generation
     * ```typescript
     * const result = await aiHandler.generateObject({
     *   schema: z.object({ title: z.string(), content: z.string() }),
     *   prompt: "Generate 3 blog post ideas",
     *   output: 'array'
     * });
     * ```
     *
     * @example Enum classification
     * ```typescript
     * const result = await aiHandler.generateObject({
     *   schema: z.string(),
     *   prompt: "Classify this sentiment: 'I love this product!'",
     *   output: 'enum',
     *   enum: ['positive', 'negative', 'neutral']
     * });
     * ```
     */
    public static async generateObject<T extends z.ZodType>(
        options: GenerateObjectOptions<T>
    ): Promise<GenerateObjectResult<T>> {
        try {
            const result = await generateText({
                model: geminiProvider(GEMINI_MODEL_NAME),
                system: options.system,
                prompt: options.prompt,
                temperature: options.temperature ?? GEMINI_MODEL_TEMPERATURE,
                stopWhen: options.stopWhen,
                experimental_context: options.experimental_context,
                maxOutputTokens: options.maxOutputTokens ?? GEMINI_MODEL_MAX_OUTPUT_TOKENS,
                // tools: [], @TODO: add tools
            });

            return {
                object: result.object as z.infer<T>,
                response: result.response,
                usage: result.usage,
                reasoning: result.reasoning,
            };
        } catch (error) {
            // Re-throw NoObjectGeneratedError with additional context
            if (NoObjectGeneratedError.isInstance(error)) {
                throw error;
            }

            // Wrap other errors with more context
            throw new Error(
                `AI SDK generateObject failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }
}