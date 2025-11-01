import { z } from "zod";

/**
 * Schema for cart item data used in product suggestions.
 */
export const cartItemForSuggestionSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productTitle: z.string().min(1, "Product title is required"),
  productDescription: z.string().nullable(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  tags: z.array(z.string()).nullable(),
});

export type CartItemForSuggestion = z.infer<typeof cartItemForSuggestionSchema>;

/**
 * Schema for a single message part.
 */
const messagePartSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

/**
 * Schema for a single message in the chat format.
 */
const messageSchema = z.object({
  parts: z.array(messagePartSchema),
  role: z.literal("user"),
});

/**
 * Schema for suggest products request using useChat format.
 * The cart items are embedded in the text of the last user message.
 */
export const suggestProductsSchema = z
  .object({
    messages: z.array(messageSchema).min(1, "At least one message is required"),
    maxSuggestions: z.number().int().min(1).max(10).optional().default(5),
  })
  .transform((data) => {
    // Extract cart items from the last user message
    const lastMessage = data.messages[data.messages.length - 1];
    if (!lastMessage) {
      throw new Error("No user message found");
    }

    // Find the text containing cart items JSON
    const textContent = lastMessage.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("");

    // Extract JSON array from the text (it should be at the end after a colon)
    // Look for pattern: "them: [json_array]"
    const jsonMatch = textContent.match(/: (\[.*\])$/);
    if (!jsonMatch) {
      throw new Error("No cart items JSON found in message");
    }

    try {
      const cartItemsJson = jsonMatch[1];
      const cartItemsData = JSON.parse(cartItemsJson);
      const cartItems = cartItemForSuggestionSchema.array().parse(cartItemsData);

      return {
        cartItems,
        maxSuggestions: data.maxSuggestions,
      };
    } catch (error) {
      throw new Error("Invalid cart items JSON in message");
    }
  });

export type SuggestProductsDto = z.infer<typeof suggestProductsSchema>;
