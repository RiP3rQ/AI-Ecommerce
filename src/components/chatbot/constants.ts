import { MessageType } from "@/types/chat";
import { nanoid } from "nanoid";

// ASSISTANT CONSTANTS
export const AI_ASSISTANT_NAME = "AI-Riper";
export const AI_ASSISTANT_AVATAR_LINK =
  "https://av26f7xvv9.ufs.sh/f/AlYD1nttismZ2zwtbIxJimuCRrYEZHOy8enaxStjXV7TMdcq";

// USER CONSTANTS
export const USER_NAME = "You";
export const USER_AVATAR_LINK =
  "https://av26f7xvv9.ufs.sh/f/AlYD1nttismZARVXxgttismZVBg5TPXqkj63Uu4yF9CfvlLH";

// SUGGESTIONS
export const SUGGESTION_PROMPTS = [
  "What are the most popular products?",
  "Show me all the hoodies I can buy",
  "Show me all the pants I can buy",
  "Show me all the shoes I can buy",
  "Show me all the accessories I can buy",
];

// INITIAL MESSAGE
export const INITIAL_MESSAGE: MessageType[] = [
  {
    id: nanoid(),
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Hello, I'm AI-Riper! How can I assist you today? Want to get product recommendations or help with reviews? Maybe you want to get the most liked products? Let me know what you need!",
      },
    ],
  },
];
