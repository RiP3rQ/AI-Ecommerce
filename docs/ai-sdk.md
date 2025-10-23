# AI SDK Integration Guide

## Overview

This project uses the Vercel AI SDK with Google's Gemini provider for text generation. The `AiSdkHandler` class provides a simple interface for AI operations with error handling and metadata tracking.

## Architecture

### Core Components

- **`AiSdkHandler`**: Class for AI SDK operations
- **`geminiProvider`**: Custom Gemini provider with timeout handling
- **`types.ts`**: Type definitions for AI operations
- **Constants**: Configuration values for model settings

### Provider Configuration

```typescript
// src/ai/gemini-provider.ts
const geminiProviderOptions = {
    apiKey: env.GEMINI_API_KEY,
    fetch: geminiLlmApiFetcher, // Custom fetcher with 59s timeout
};
```

### Model Configuration

```typescript
// src/ai/constants.ts
export const GEMINI_MODEL_NAME = "gemini-2.5-flash";
export const GEMINI_MODEL_TEMPERATURE = 0.1;
export const GEMINI_MODEL_MAX_OUTPUT_TOKENS = 1000;
export const GEMINI_API_TIMEOUT = 59000; // 59 seconds
```

## Usage

### Basic Text Generation

```typescript
import { AiSdkHandler } from '@/ai/ai-sdk';

const aiHandler = new AiSdkHandler();

const result = await aiHandler.generateText({
    prompt: "Explain quantum computing in simple terms"
});

console.log(result.text); // Generated text response
```

### generateText Method

Generates text using the Gemini AI model:

```typescript
public async generateText(
    options: GenerateTextOptions
): Promise<GenerateTextResult>
```

#### Parameters

- **`system`** (optional): System prompt to set AI behavior and context
- **`prompt`**: Text prompt or array of conversation messages for the AI model
- **`temperature`** (optional): Creativity level (0.0-1.0), defaults to 0.1
- **`maxOutputTokens`** (optional): Maximum tokens to generate, defaults to 1000
- **`tools`** (optional): Tools available for the AI model to use during generation
- **`stopWhen`** (optional): Conditions to stop generation early
- **`experimental_context`** (optional): Experimental context for advanced use cases

#### Return Value

Returns a `GenerateTextResultType` object containing:

- **`text`**: The generated text response
- **`response`**: Provider response metadata (headers, body)
- **`usage`**: Token usage information (prompt, completion, total tokens)
- **`reasoning`**: Model's reasoning process (if available)
- **`toolCalls`**: Information about tool calls made during generation
- **`toolResults`**: Results from tool executions

```typescript
interface GenerateTextResult {
    text: string;                 // The generated text response
    response: {                   // Provider response metadata
        headers?: Record<string, string>;
        body?: unknown;
    };
    usage?: {                     // Token consumption details
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
    reasoning?: string;           // Model's thought process (if available)
    toolCalls?: Array<{           // Information about tool calls made
        toolCallId: string;
        toolName: string;
        args: unknown;
    }>;
    toolResults?: Array<{         // Results from tool executions
        toolCallId: string;
        toolName: string;
        args: unknown;
        result: unknown;
    }>;
}
```

### Accessing Metadata

```typescript
const result = await aiHandler.generateText({ prompt: "Hello AI!" });

// Log token usage for monitoring and cost tracking
if (result.usage?.totalTokens) {
    console.log(`Tokens used: ${result.usage.totalTokens}`);
    console.log(`Prompt tokens: ${result.usage.promptTokens}`);
    console.log(`Completion tokens: ${result.usage.completionTokens}`);
}

// Access response headers (useful for debugging)
if (result.response.headers) {
    console.log('Response headers:', result.response.headers);
}

// Model reasoning (available with some providers/models)
if (result.reasoning) {
    console.log('Model reasoning:', result.reasoning);
}

// Tool usage tracking
if (result.toolCalls?.length) {
    console.log(`Tools called: ${result.toolCalls.length}`);
    result.toolCalls.forEach(call => {
        console.log(`- ${call.toolName}:`, call.args);
    });
}

if (result.toolResults?.length) {
    console.log(`Tool results: ${result.toolResults.length}`);
    result.toolResults.forEach(toolResult => {
        console.log(`- ${toolResult.toolName} result:`, toolResult.result);
    });
}
```

## Token Output and Usage Tracking

### Token Types

- **Prompt Tokens**: Input tokens (your prompt + schema information)
- **Completion Tokens**: Output tokens (generated content)
- **Total Tokens**: Sum of prompt and completion tokens

### Usage Monitoring

Track token consumption for:
- Cost monitoring
- Performance optimization
- Rate limiting
- Usage analytics

```typescript
const result = await aiHandler.generateText({ prompt: "Hello AI!" });

const { usage } = result;
const cost = calculateCost(usage); // Implement based on provider pricing
logger.info('AI request completed', {
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    estimatedCost: cost
});
```

## Error Handling

### Structured Error Types

- **`NoObjectGeneratedError`**: AI failed to generate valid structured data
- **Network/Timeout Errors**: Wrapped with context
- **Validation Errors**: Zod schema validation failures

### Error Handling Patterns

```typescript
try {
    const result = await aiHandler.generateText({ prompt: "Hello AI!" });
    return result.object;
} catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
        // Handle AI generation failures
        logger.error('AI generation failed', {
            cause: error.cause,
            text: error.text,
            response: error.response,
            usage: error.usage
        });
        throw new ApiError('Failed to generate content', 500);
    }

    // Handle other errors
    throw new ApiError('AI service unavailable', 503);
}
```

## Advanced Concepts

### Temperature Control

- **Low (0.0-0.3)**: More deterministic, factual responses
- **Medium (0.4-0.7)**: Balanced creativity and consistency
- **High (0.8-1.0)**: More creative, diverse responses

### Token Optimization

- **Max Tokens**: Balance between completeness and cost
- **Prompt Engineering**: Clear, specific prompts reduce token usage
- **Schema Design**: Well-structured schemas guide efficient generation

### Streaming Considerations

For real-time applications, consider using `streamObject` instead of `generateText`:

```typescript
// For future streaming implementation
import { streamObject } from 'ai';

const { partialObjectStream } = streamObject({
    model: geminiProvider(GEMINI_MODEL_NAME),
    schema,
    prompt
});

for await (const partial of partialObjectStream) {
    // Handle partial results
}
```

### Caching Strategies

Implement caching for frequently requested data:

```typescript
// Example caching wrapper
async function cachedGenerateText(
    cacheKey: string,
    options: GenerateTextOptions
): Promise<GenerateTextResult> {
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const result = await aiHandler.generateText(options);
    await cache.set(cacheKey, result, { ttl: 3600 }); // 1 hour
    return result;
}
```

### Rate Limiting

Implement rate limiting based on token usage:

```typescript
// Example rate limiter
class RateLimiter {
    private tokensUsed = 0;
    private readonly maxTokensPerMinute = 10000;

    async checkLimit(requestTokens: number): Promise<void> {
        if (this.tokensUsed + requestTokens > this.maxTokensPerMinute) {
            throw new Error('Rate limit exceeded');
        }
        this.tokensUsed += requestTokens;
        // Reset counter periodically
    }
}
```

## Best Practices

### Prompt Engineering
- Be specific and clear
- Include examples in prompts
- Use schema names and descriptions
- Test prompts iteratively

### Schema Design
- Use descriptive field names
- Add Zod descriptions for complex fields
- Prefer unions over optional fields when appropriate
- Validate schemas thoroughly

### Monitoring and Observability
- Log all AI requests with metadata
- Monitor token usage patterns
- Track error rates and types
- Set up alerts for high error rates

### Performance Optimization
- Use appropriate temperature settings
- Cache frequent requests
- Batch similar requests when possible
- Monitor response times

## Troubleshooting

### Common Issues

1. **Timeout Errors**: Increase `GEMINI_API_TIMEOUT` or optimize prompts
2. **Invalid Schema**: Validate schemas with test data
3. **High Token Usage**: Review prompts and schema complexity
4. **Inconsistent Output**: Lower temperature or refine prompts

### Debugging Tips

- Enable detailed logging for AI requests
- Test with simple schemas first
- Use the AI SDK playground for prompt testing
- Monitor provider-specific headers for additional context

## Future Enhancements

- Implement streaming for real-time applications
- Add support for multiple providers with automatic failover
- Implement request batching for efficiency
- Add comprehensive telemetry and metrics
- Support for custom model configurations
