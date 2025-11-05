import { ToolUIPart } from "ai";

export enum MessageFrom {
  USER = "user",
  ASSISTANT = "assistant",
}

export interface MessageType {
  key: string;
  from: MessageFrom;
  sources?: Array<{ href: string; title: string }>;
  versions: Array<{ id: string; content: string }>;
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
