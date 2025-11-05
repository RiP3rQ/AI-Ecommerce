import type { UIMessage } from "ai";

/**
 * Request payload for the AI assistant endpoint.
 */
export interface AiAssistantRequest {
  messages: UIMessage[];
  model: string;
  webSearch: boolean;
}

/**
 * Response data structure for successful AI assistant requests.
 */
export interface AiAssistantResponse {
  success: boolean;
  data: {
    message: string;
    sources?: string[];
    reasoning?: string;
  };
}
