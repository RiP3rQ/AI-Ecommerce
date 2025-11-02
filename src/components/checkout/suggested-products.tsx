"use client";

import { useState, useEffect, type ReactNode } from "react";
import { ProductCardWithAddToCart } from "./product-card-with-add-to-cart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/providers/cart-provider";
import { Sparkles, Loader2, ShoppingBag } from "lucide-react";
import { getProductSuggestions } from "@/lib/ai-api";
import type { SuggestProductsResponse } from "@/app/api/ai/suggest-products/types";
import { isFeatureEnabled } from "@/lib/feature-flags";

/**
 * Component that displays AI-powered suggested products.
 * Uses RAG system to generate personalized recommendations based on cart items.
 * Protected feature - requires authentication.
 */
export function SuggestedProducts(): ReactNode {
  // Feature flag check
  if (!isFeatureEnabled("aiProductSuggestions")) {
    return null;
  }

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { cart, isLoading: cartLoading } = useCart();

  // State for suggestions
  const [suggestions, setSuggestions] = useState<
    SuggestProductsResponse["data"]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user has items in cart
  const hasCartItems = cart?.lines && cart.lines.length > 0;

  const handleGenerateSuggestions = async () => {
    if (!hasCartItems) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getProductSuggestions();
      setSuggestions(response.data);
    } catch (err) {
      console.error("Error generating suggestions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate suggestions",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset suggestions when cart changes
  useEffect(() => {
    if (!hasCartItems) {
      setSuggestions([]);
      setError(null);
    }
  }, [hasCartItems]);

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

  if (!hasCartItems) {
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

        {suggestions.length === 0 && !isLoading && (
          <Button
            onClick={handleGenerateSuggestions}
            disabled={isLoading}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Get AI Suggestions
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Generating Suggestions
            </h3>
            <p className="text-muted-foreground">
              Our AI is analyzing your cart and finding perfect
              recommendations...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="text-sm text-destructive mb-2">{error}</div>
            <Button
              onClick={handleGenerateSuggestions}
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Product Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">
              Personalized Recommendations
            </h3>
          </div>

          {/* Grid layout for product cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestions.map((suggestion) => {
              if (!suggestion.productData) return null;

              // Transform ProductData to ProductWithVariantsAndOptions
              const product = {
                ...suggestion.productData,
                variants: suggestion.productData.product_variants || [],
                options: suggestion.productData.product_options || [],
                // Add required fields from ProductWithDetails
                category: null, // AI suggestions don't include category
                featuredImage:
                  suggestion.productData.product_images?.[0] || null,
                minPrice:
                  suggestion.productData.priceRange.minVariantPrice.amount,
                maxPrice:
                  suggestion.productData.priceRange.maxVariantPrice.amount,
                currencyCode:
                  suggestion.productData.priceRange.minVariantPrice
                    .currencyCode,
                variantCount:
                  suggestion.productData.product_variants?.length || 0,
              };

              return (
                <ProductCardWithAddToCart
                  key={suggestion.productId}
                  product={product}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Initial state - show button to generate suggestions */}
      {suggestions.length === 0 && !isLoading && !error && (
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
              disabled={isLoading}
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
