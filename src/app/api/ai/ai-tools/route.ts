import { type NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/errors';
import { aiToolsService } from './service';
import type { GetAiToolsResponseDto } from './dto';

/**
 * GET /api/ai/ai-tools
 * Returns a list of all available AI tools with user-friendly descriptions
 *
 * This endpoint provides information about the AI assistant's capabilities
 * to help users understand what they can ask the AI to do.
 *
 * Response:
 * - tools: Array of objects containing tool name and description
 *
 * @returns JSON response with all available AI tools
 */
export async function GET(request: NextRequest) {
  try {
    // Get all available AI tools with descriptions
    const tools = aiToolsService.getAllTools();

    const response: GetAiToolsResponseDto = {
      tools
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
