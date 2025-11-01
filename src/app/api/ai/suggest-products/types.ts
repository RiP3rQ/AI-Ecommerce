/**
 * Product suggestion with relevance score and reasoning.
 */
export interface ProductSuggestion {
  productId: string;
  title: string;
  description: string | null;
  tags: string[] | null;
  relevanceScore: number;
  reasoning: string;
}

/**
 * Response for suggest products API.
 */
export interface SuggestProductsResponse {
  success: boolean;
  data: {
    suggestions: ProductSuggestion[];
    totalSuggestions: number;
    cartItemsAnalyzed: number;
  };
}
