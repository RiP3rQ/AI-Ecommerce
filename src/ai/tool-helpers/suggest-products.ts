import { embed } from "ai";
import { drizzleDbClient } from "@/database";
import { products } from "@/database/schema";
import { geminiProvider } from "../gemini-provider";
import { cosineDistance, desc, gt, ne, and, sql } from "drizzle-orm";

/**
 * Configuration for embedding similarity search.
 */
const SIMILARITY_CONFIG = {
  model: geminiProvider.textEmbeddingModel("gemini-embedding-001"),
  outputDimensionality: 1536,
  similarityThreshold: 0.3, // Minimum similarity score (0-1)
  maxSuggestions: 5, // Maximum number of suggestions to return
} as const;

/**
 * Creates a rich text representation of cart items for embedding generation.
 */
function createCartEmbeddingText(
  cartItems: Array<{
    productTitle: string;
    productDescription?: string | null;
    quantity: number;
    tags?: string[] | null;
  }>,
): string {
  const itemsText = cartItems
    .map((item) => {
      const parts = [`${item.productTitle} (quantity: ${item.quantity})`];

      if (item.productDescription) {
        parts.push(item.productDescription);
      }

      if (item.tags && item.tags.length > 0) {
        parts.push(`Tags: ${item.tags.join(", ")}`);
      }

      return parts.join(" ");
    })
    .join(" | ");

  return `Cart items: ${itemsText}`;
}

/**
 * Finds products similar to the items in the cart using embeddings.
 */
export async function findSimilarProducts(
  cartItems: Array<{
    productId: string;
    productTitle: string;
    productDescription?: string | null;
    quantity: number;
    tags?: string[] | null;
  }>,
): Promise<
  Array<{
    id: string;
    title: string;
    description: string | null;
    tags: string[] | null;
    similarity: number;
  }>
> {
  if (cartItems.length === 0) {
    return [];
  }

  const db = drizzleDbClient();

  // Create embedding text from cart items
  const cartText = createCartEmbeddingText(cartItems);

  try {
    // Generate embedding for the cart
    const result = await embed({
      model: SIMILARITY_CONFIG.model,
      value: cartText,
      providerOptions: {
        google: {
          outputDimensionality: SIMILARITY_CONFIG.outputDimensionality,
        },
      },
    });

    const cartEmbedding = result.embedding;

    // Find similar products using cosine similarity
    // Exclude products already in cart
    const cartProductIds = cartItems.map((item) => item.productId);

    const similarity = sql<number>`1 - (${cosineDistance(
      products.embedding,
      cartEmbedding,
    )})`;

    const similarProducts = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        tags: products.tags,
        similarity,
      })
      .from(products)
      .where(
        and(
          gt(similarity, SIMILARITY_CONFIG.similarityThreshold),
          ne(products.availableForSale, false),
          ...cartProductIds.map((id) => ne(products.id, id)),
        ),
      )
      .orderBy(desc(similarity))
      .limit(SIMILARITY_CONFIG.maxSuggestions);

    return similarProducts;
  } catch (error) {
    console.error("Error finding similar products:", error);
    // Return empty array on error to prevent breaking the AI flow
    return [];
  }
}
