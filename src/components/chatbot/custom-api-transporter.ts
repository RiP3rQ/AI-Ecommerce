import { MessageType } from "@/types/chat";
import { DefaultChatTransport } from "ai";

// Custom transport that filters out reasoning and tool parts before sending to API
export class FilteredChatTransport extends DefaultChatTransport<MessageType> {
  constructor(options: any) {
    super(options);
  }

  async sendMessages(options: any) {
    // Filter messages to only include text parts
    const filteredMessages = options.messages.map((message: MessageType) => ({
      ...message,
      parts: message.parts.filter((part: any) => part.type === "text"),
    }));

    const filteredOptions = {
      ...options,
      messages: filteredMessages,
    };

    return super.sendMessages(filteredOptions);
  }
}
