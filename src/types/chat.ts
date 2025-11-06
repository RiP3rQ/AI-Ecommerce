import type { ToolUIPart, UIMessage, UIDataTypes, UITools } from "ai";

export enum MessageFrom {
  USER = "user",
  ASSISTANT = "assistant",
}

export interface MessageType extends UIMessage<unknown, UIDataTypes, UITools> {
  sources?: Array<{ href: string; title: string }>;
  reasoning?: { content: string; duration: number };
  tools?: Array<{
    name: string;
    description: string;
    status: ToolUIPart["state"];
    parameters: Record<string, unknown>;
    result: string | undefined;
    error: string | undefined;
  }>;
  avatar: string;
  name: string;
}
