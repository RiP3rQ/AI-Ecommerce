"use client";

import { useMemo, useState, useEffect, type ReactNode } from "react";
import { useChat } from "@ai-sdk/react";
import { ProductCardWithAddToCart } from "./product-card-with-add-to-cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/providers/cart-provider";
import { Sparkles, Loader2, ShoppingBag } from "lucide-react";
import type { ProductWithDetails } from "@/app/api/shop/types";
import type { SelectProductVariant } from "@/database/schemas/product-variants";
import type { SelectProductOption } from "@/database/schemas/product-options";
import { DefaultChatTransport } from "ai";

/**
 * Type for AI-suggested products from the API
 */
interface SuggestedProduct {
  productId: string;
  title: string;
  description: string | null;
  tags: string[] | null;
  relevanceScore: number;
  reasoning: string;
}

/**
 * Component that displays AI-powered suggested products.
 * Uses RAG system to generate personalized recommendations based on cart items.
 * Protected feature - requires authentication.
 */
export function SuggestedProducts(): ReactNode {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { cart, isLoading: cartLoading } = useCart();

  // Initialize useChat hook for AI-powered suggestions
  const { messages, sendMessage, status, error, clearError } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/suggest-products",
    }),
    onError: (error) => {
      console.error("Error generating suggestions:", error);
    },
  });

  // Extract cart items for suggestions
  const cartItemsForSuggestions = useMemo((): any[] => {
    if (!cart?.lines) return [];

    return cart.lines.map((item) => ({
      productId: item.merchandise.product.id,
      productTitle: item.merchandise.product.title,
      productDescription: null, // Cart doesn't include description
      quantity: item.quantity,
      tags: null, // Cart doesn't include tags
    }));
  }, [cart]);

  // Extract streaming text and suggestions from messages
  const latestAssistantMessage = messages
    .filter((msg) => msg.role === "assistant")
    .slice(-1)[0];

  console.log("latestAssistantMessage", latestAssistantMessage);

  const isStreaming = status === "streaming" || status === "submitted";
  const streamingText =
    latestAssistantMessage?.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("") || "";

  console.log("streamingText", streamingText);

  // Parse suggestions from the final assistant message
  const suggestedProducts = useMemo((): SuggestedProduct[] => {
    if (!latestAssistantMessage || status !== "ready") return [];

    // Look for tool results in the message parts
    const toolResults = latestAssistantMessage.parts
      .filter(
        (
          part,
        ): part is Extract<
          typeof part,
          { type: "dynamic-tool"; state: "output-available" }
        > =>
          part.type === "dynamic-tool" &&
          part.toolName === "suggestProducts" &&
          part.state === "output-available",
      )
      .map((part) => part.output)
      .filter(Boolean);

    if (toolResults.length === 0) return [];

    try {
      const result = toolResults[0] as {
        suggestions: Array<{
          id: string;
          title: string;
          description: string | null;
          tags: string[] | null;
          relevanceScore: number;
        }>;
      };

      return result.suggestions.map((suggestion) => ({
        productId: suggestion.id,
        title: suggestion.title,
        description: suggestion.description,
        tags: suggestion.tags,
        relevanceScore: suggestion.relevanceScore,
        reasoning: `Based on your cart items, this product complements your selection with ${Math.round(suggestion.relevanceScore * 100)}% relevance.`,
      }));
    } catch (error) {
      console.error("Error parsing suggestions:", error);
      return [];
    }
  }, [latestAssistantMessage, status]);

  console.log("suggestedProducts", suggestedProducts);

  // State for full product data needed for ProductCardWithAddToCart
  const [fullProductData, setFullProductData] = useState<
    Array<
      ProductWithDetails & {
        variants: SelectProductVariant[];
        options: SelectProductOption[];
      }
    >
  >([]);

  const handleGenerateSuggestions = () => {
    if (cartItemsForSuggestions.length === 0) return;

    // Clear any previous error
    clearError();

    // Send message to AI with cart items data
    sendMessage({
      text: `Please analyze these cart items and suggest ${Math.min(5, cartItemsForSuggestions.length * 2)} complementary products that would go well with them: ${JSON.stringify(cartItemsForSuggestions)}`,
    });
  };

  if (authLoading || cartLoading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Loading skeleton */}
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="w-full h-48 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">You might also like</h2>
        <AuthGuard
          title="AI-Powered Product Suggestions"
          description="Login to unlock personalized product recommendations powered by artificial intelligence."
          feature="AI product suggestions"
        />
      </div>
    );
  }

  if (cartItemsForSuggestions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Add items to your cart</h3>
          <p className="text-muted-foreground">
            Add some products to your cart to get AI-powered recommendations!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">You might also like</h2>

        {suggestedProducts.length === 0 && !isStreaming && !streamingText && (
          <Button
            onClick={handleGenerateSuggestions}
            disabled={isStreaming || status === "error"}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Get AI Suggestions
          </Button>
        )}
      </div>

      {/* AI Thinking Process */}
      {isStreaming && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Assistant is working...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {streamingText ||
                "Analyzing your cart and finding perfect recommendations..."}
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing your request...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {status === "error" && error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="text-sm text-destructive">
              Sorry, I couldn't generate suggestions right now. Please try
              again.
            </div>
            <Button
              onClick={clearError}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Product Suggestions */}
      {fullProductData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">
              Personalized Recommendations
            </h3>
          </div>

          {/* Grid layout for product cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fullProductData.map((product) => (
              <ProductCardWithAddToCart
                key={product.id}
                product={{
                  ...product,
                  variants: (product as any).product_variants || [],
                  options: (product as any).product_options || [],
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Initial state - show button to generate suggestions */}
      {suggestedProducts.length === 0 && !isStreaming && !streamingText && (
        <Card>
          <CardContent className="p-6 text-center">
            <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              AI-Powered Recommendations
            </h3>
            <p className="text-muted-foreground mb-4">
              Get personalized product suggestions based on your cart items
              using our advanced AI system.
            </p>
            <Button
              onClick={handleGenerateSuggestions}
              disabled={isStreaming}
              size="lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Discover Perfect Matches
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
