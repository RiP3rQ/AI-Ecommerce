# AI SDK Chatbot Tools Documentation

This document outlines how to use tools in a chatbot application with the AI SDK, focusing on `useChat` and `streamText`.

## 1. Tool Types

The AI SDK supports three types of tools:
1.  **Server-Side (Auto-Executed):** Defined with an `execute` function on the server. They run automatically, and their results are streamed to the client.
2.  **Client-Side (Auto-Executed):** Defined on the server without an `execute` function. The client handles their execution via the `onToolCall` callback.
3.  **Client-Side (User Interaction):** Require user action on the client, like clicking a confirmation button. The UI is rendered based on tool-specific message parts.

## 2. Core Architecture Flow

1.  **User Input:** The user sends a message from the client UI.
2.  **Server Processing:** The API route receives the message and uses `streamText` with a defined `tools` object. The language model generates tool calls.
3.  **Streaming to Client:** All tool calls (and results from server-side tools) are streamed to the client.
4.  **Client-Side Handling:**
    *   The `useChat` hook receives the tool calls.
    *   Automatic client tools trigger the `onToolCall` callback.
    *   Interaction-based tools are rendered as UI components from typed `message.parts`.
5.  **Sending Results:** The client uses `addToolOutput` to send tool execution results back to the AI.
6.  **Continuation:** The `useChat` hook can be configured with `sendAutomaticallyWhen` to automatically send the results back to the server, continuing the conversation.

## 3. Server-Side Implementation (`streamText`)

On the server (e.g., `app/api/chat/route.ts`), configure `streamText` from the `ai` package.

-   **`model`**: The language model to use (e.g., `openai('gpt-4o')`).
-   **`messages`**: The conversation history.
-   **`tools`**: An object defining all available tools.
    -   **Server-Side Tools**: Include a `description`, `inputSchema` (using Zod), and an `execute` async function.
    -   **Client-Side Tools**: Include a `description` and `inputSchema`, but OMIT the `execute` function.
-   **Response:** Return the stream using `result.toUIMessageStreamResponse()`.

## 4. Client-Side Implementation (`useChat`)

On the client (e.g., `app/page.tsx`), use the `useChat` hook from `@ai-sdk/react`.

### Key `useChat` Options:

-   **`onToolCall({ toolCall })`**: A callback to handle automatically executed client-side tools.
    -   Inside, check `if (toolCall.toolName === 'your-tool-name')`.
    -   Call `addToolOutput` with the `toolCallId` and the `output`. **Do not `await` this call** to prevent deadlocks.
    -   For type safety, first check `if (toolCall.dynamic)` and return if true before handling specific tools.
-   **`sendAutomaticallyWhen`**: A function to determine when to re-submit the chat with tool results. Use `lastAssistantMessageIsCompleteWithToolCalls` from `ai` for standard behavior.

### Rendering Tool UI

The assistant's `message.parts` array contains the data needed to render the UI for tool calls. Iterate over this array and use a `switch` statement on `part.type`.

-   **Text:** `part.type === 'text'`. Render `part.text`.
-   **Tools:** For a tool named `myTool`, the type will be `part.type === 'tool-myTool'`.
-   **Dynamic Tools:** `part.type === 'dynamic-tool'` for tools not known at compile time.

### Tool Part `state`

Each tool part has a `state` property that reflects its lifecycle, which is crucial for rendering the correct UI:
-   `input-streaming`: The tool's input arguments are being generated.
-   `input-available`: The tool's input is fully available. For interaction tools, this is when you render buttons or forms.
-   `output-available`: The tool has run successfully and the `part.output` is available to display.
-   `output-error`: The tool execution failed. Display the `part.errorText`.

When a user interacts with a UI element (e.g., clicks a "Confirm" button), call `addToolOutput` with the `toolCallId` and the result.

## 5. Advanced Topics

### Error Handling

-   **Client-Side:** In `onToolCall`, wrap your tool execution in a `try...catch` block. If an error occurs, call `addToolOutput` with `state: 'output-error'` and the `errorText`.
-   **Server-Side:** Language model errors (e.g., invalid tool arguments) are masked by default. To reveal them, pass an `onError` handler to `toUIMessageStreamResponse`.

### Multi-Step Tool Calls

-   **UI Separators:** When a message involves multiple tool call steps, the `message.parts` array will include parts with `type: 'step-start'`. You can use these to render visual separators (e.g., an `<hr />`) between steps.
-   **Server-Side Limits:** For server-only multi-step calls, you can limit the number of steps using the `stopWhen: stepCountIs(N)` option in `streamText`.
