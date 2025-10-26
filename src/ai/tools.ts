import { tool, type ToolSet } from "ai";
import z from "zod";

export function getAiTools(): ToolSet | undefined {
  return {
    get_user_info: tool({
      description: "Get user information",
      inputSchema: z.object({
        userId: z.string(),
      }),
      onInputAvailable: (options) => {
        console.log(options);
      },
      execute: async (input, options) => {
        return {
          name: `John Doe - ${options.toolCallId}`,
          email: "john.doe@example.com",
        };
      },
      outputSchema: z.object({
        name: z.string(),
        email: z.string(),
      }),
    }),
  };
}
