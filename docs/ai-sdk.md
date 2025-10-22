# AI SDK Integration Guide

## Overview

This project uses the Vercel AI SDK with Google's Gemini provider for structured data generation. The `AiSdkHandler` class provides a unified, type-safe interface for all AI operations, ensuring consistent error handling, metadata tracking, and performance monitoring.

## Architecture

### Core Components

- **`AiSdkHandler`**: Singleton class managing all AI SDK operations
- **`geminiProvider`**: Custom Gemini provider with timeout handling
- **Constants**: Configuration values for model settings and timeouts

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

## AI SDK Call Handling

### Singleton Pattern

The `AiSdkHandler` uses a singleton pattern to ensure:
- Single point of configuration
- Connection pooling efficiency
- Consistent behavior across the application

```typescript
const aiHandler = AiSdkHandler.getInstance();
```

### generateObject Method

This is the only public method, focusing on structured data generation:

```typescript
public async generateObject<T extends z.ZodType>(
    options: GenerateObjectOptions<T>
): Promise<GenerateObjectResult<T>>
```

#### Parameters

- **`schema`**: Zod schema defining expected output structure
- **`prompt`**: Text prompt for the AI model
- **`schemaName`** (optional): Name for better AI guidance
- **`schemaDescription`** (optional): Description for better AI guidance
- **`output`** (optional): Strategy - 'object', 'array', 'enum', 'no-schema'
- **`enum`** (optional): For enum output, list of possible values
- **`temperature`** (optional): Creativity level (0.0-1.0), defaults to 0.1
- **`maxTokens`** (optional): Maximum tokens to generate, defaults to 1000

## Output Data Handling

### Structured Validation

All outputs are validated against Zod schemas before being returned:

```typescript
const schema = z.object({
    name: z.string(),
    age: z.number(),
    hobbies: z.array(z.string())
});

const result = await aiHandler.generateObject({ schema, prompt });
result.object // TypeScript knows this is { name: string, age: number, hobbies: string[] }
```

### Output Strategies

#### Object (Default)
Generates a single object matching the schema.

#### Array
Generates an array of objects. The schema defines the structure of each array element.

```typescript
const result = await aiHandler.generateObject({
    schema: z.object({ title: z.string(), content: z.string() }),
    output: 'array',
    prompt: "Generate 3 blog post ideas"
});
// result.object is Array<{ title: string, content: string }>
```

#### Enum
Classifies input into one of predefined categories.

```typescript
const result = await aiHandler.generateObject({
    schema: z.string(),
    output: 'enum',
    enum: ['positive', 'negative', 'neutral'],
    prompt: "Classify: 'I love this product!'"
});
// result.object is 'positive' | 'negative' | 'neutral'
```

#### No Schema
Free-form generation without validation (use sparingly).

## Metadata from Provider

### Response Metadata

Every `generateObject` call returns comprehensive metadata:

```typescript
interface GenerateObjectResult<T> {
    object: z.infer<T>;           // The validated structured data
    response: {                   // Provider response metadata
        headers: Record<string, string>;
        body: unknown;
    };
    usage: {                      // Token consumption details
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    reasoning?: string;           // Model's thought process (if available)
}
```

### Accessing Metadata

```typescript
const result = await aiHandler.generateObject({ schema, prompt });

// Log token usage for monitoring
console.log(`Tokens used: ${result.usage.totalTokens}`);

// Access response headers (useful for debugging)
console.log('Response headers:', result.response.headers);

// Model reasoning (available with some providers/models)
if (result.reasoning) {
    console.log('Model reasoning:', result.reasoning);
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
const result = await aiHandler.generateObject({ schema, prompt });

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
    const result = await aiHandler.generateObject({ schema, prompt });
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

For real-time applications, consider using `streamObject` instead of `generateObject`:

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
async function cachedGenerateObject<T extends z.ZodType>(
    cacheKey: string,
    options: GenerateObjectOptions<T>
): Promise<GenerateObjectResult<T>> {
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const result = await aiHandler.generateObject(options);
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
