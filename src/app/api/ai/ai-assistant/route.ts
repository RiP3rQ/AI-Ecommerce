import type { NextRequest } from "next/server";
import { handleApiError } from "@/lib/errors";
import { aiAssistantService } from "./service";
import { drizzleDbClient } from "@/database";
import { checkAndSaveAiUsage, validateServerSession } from "@/lib/api-helpers";
import { BodyType } from "./types";

// Allow streaming responses up to configured duration (default: 30 seconds)
export const maxDuration = 30; // 30 seconds

/**
 * POST /api/ai/ai-assistant
 * Provides streaming AI assistant functionality with optional web search capabilities.
 *
 * This endpoint streams AI responses in real-time, allowing for interactive conversations.
 * Supports both general assistance and web-enabled search functionality.
 *
 * Body Parameters:
 * - messages (required): Array of conversation messages (1-50 messages)
 *   - role: "user" | "assistant"
 *   - content: Message text (non-empty)
 *   - id (optional): Message identifier
 *   - createdAt (optional): Message timestamp
 *
 * Response:
 * Streams UI messages with optional sources and reasoning data.
 *
 * @param request - The incoming request with conversation data
 * @returns Streaming response with AI-generated messages
 */
export async function POST(request: NextRequest) {
  try {
    const dbClient = drizzleDbClient();

    // Step 1: Validate user session
    const user = await validateServerSession();

    // Step 2: Parse the request body
    const body: BodyType = await request.json();

    // Step 3: Check AI usage limits
    await checkAndSaveAiUsage({
      dbClient,
      userId: user.id,
    });

    // Step 4: Generate streaming AI response
    const result = await aiAssistantService.generateStreamingResponse({
      body,
      userId: user.id,
      abortSignal: request.signal,
    });

    // Step 5: Return streaming response with sources and reasoning
    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
