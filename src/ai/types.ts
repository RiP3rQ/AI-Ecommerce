import type {
  ModelMessage,
  StopCondition,
  Tool,
  ToolSet,
  TypedToolCall,
  TypedToolResult,
  ReasoningOutput,
  ProviderMetadata,
  LanguageModelUsage,
} from "ai";

/**
 * Result type for generateText operations.
 */
export interface GenerateTextResultType {
  /** The generated text response from the AI model. */
  text: string;
  /** Token usage information for the request. */
  usage: LanguageModelUsage;
  /** Model's reasoning process (if available). */
  reasoning: ReasoningOutput[];
  /** Information about tool calls made during generation. */
  toolCalls: TypedToolCall<Record<string, Tool>>[];
  /** Results from tool executions. */
  toolResults: TypedToolResult<Record<string, Tool>>[];
  /** Metadata about the AI provider response including headers, status, etc. */
  providerMetadata?: ProviderMetadata;
}

/**
 * Configuration options for generateText operations.
 */
export interface GenerateTextOptions {
  /** The system prompt to send to the AI model. */
  system?: string;
  /** The prompt to send to the AI model. */
  prompt: string | Array<ModelMessage>;
  /** Temperature setting for response creativity (0.0 to 1.0). */
  temperature?: number;
  /** The stop conditions for the generation. */
  stopWhen?:
    | StopCondition<NoInfer<ToolSet>>
    | StopCondition<NoInfer<ToolSet>>[];
  /** Experimental context for the generation. */
  experimental_context?: unknown;
  /** The maximum number of tokens to generate. */
  maxOutputTokens?: number;
  /** Tools available for the AI model to use. */
  tools?: Record<string, Tool>;
}

/**
 * Configuration options for streamText operations.
 */
export interface StreamTextOptions extends Omit<GenerateTextOptions, "prompt"> {
  /** Provider options for the AI model. */
  providerOptions?: Record<string, any>;
  /** The messages to send to the AI model. */
  messages: Array<ModelMessage>;
  /** Abort signal for cancelling the request. */
  abortSignal?: AbortSignal;
  /** Callback for when the request is aborted. */
  onAbort?: (event: { readonly steps: readonly any[] }) => void;
  /** Callback for when an error occurs. */
  onError?: (event: { error: unknown }) => void;
}
