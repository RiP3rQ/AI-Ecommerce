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
  maxSuggestions: 4, // Maximum number of suggestions to return
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
    tags: string[] | null;
    similarity: number;
  }>
> {
  console.log("Executing findSimilarProducts...");
  if (cartItems.length === 0) {
    return [];
  }

  const db = drizzleDbClient();

  // Create embedding text from cart items
  console.log("Creating cart embedding text...");
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

    console.log("Generated embedding for the cart...");

    const cartEmbedding = result.embedding;

    // Find similar products using cosine similarity
    // Filter out cart items that have valid UUID format (to avoid DB errors)
    const validCartProductIds = cartItems
      .map((item) => item.productId)
      .filter((id) => {
        // Check if ID is a valid UUID format to avoid PostgreSQL errors
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
      });

    const similarity = sql<number>`1 - (${cosineDistance(
      products.embedding,
      cartEmbedding,
    )})`;

    // Build where conditions
    const whereConditions = [
      gt(similarity, SIMILARITY_CONFIG.similarityThreshold),
      ne(products.availableForSale, false),
    ];

    // Only add exclusion for valid UUIDs to prevent DB errors
    if (validCartProductIds.length > 0) {
      whereConditions.push(
        ...validCartProductIds.map((id) => ne(products.id, id)),
      );
    }

    console.log("Fetching similar products...");

    const similarProducts = await db
      .select({
        id: products.id,
        title: products.title,
        tags: products.tags,
        similarity,
      })
      .from(products)
      .where(and(...whereConditions))
      .orderBy(desc(similarity))
      .limit(SIMILARITY_CONFIG.maxSuggestions);

    console.log("Similar products fetched...");
    console.log("similarProducts", similarProducts);

    return similarProducts;
  } catch (error) {
    console.error("Error finding similar products:", error);
    // Return empty array on error to prevent breaking the AI flow
    return [];
  }
}
