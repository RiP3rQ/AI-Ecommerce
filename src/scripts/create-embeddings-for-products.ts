import { drizzleDbClient } from "@/database";
import { products } from "@/database/schema";
import { eq, isNull } from "drizzle-orm";
import { embed } from "ai";
import { geminiProvider } from "@/ai/gemini-provider";

/**
 * Script to create embeddings for products that don't have them.
 * This script fetches all products without embeddings and generates
 * embeddings using Gemini models via the AI SDK.
 */

/**
 * Configuration for embedding generation.
 */
const EMBEDDING_CONFIG = {
  model: geminiProvider.textEmbeddingModel("gemini-embedding-001"), // Gemini embedding model
  outputDimensionality: 1536,
  batchSize: 10, // Process products in batches to avoid rate limits
} as const;

/**
 * Fetches products that don't have embeddings yet.
 */
async function getProductsWithoutEmbeddings() {
  const db = drizzleDbClient();

  console.log("Fetching products without embeddings...");

  const productsWithoutEmbeddings = await db
    .select({
      id: products.id,
      title: products.title,
      description: products.description,
      tags: products.tags,
    })
    .from(products)
    .where(isNull(products.embedding));

  console.log(
    `Found ${productsWithoutEmbeddings.length} products without embeddings`,
  );

  return productsWithoutEmbeddings;
}

/**
 * Generates embeddings for a batch of products.
 */
async function generateEmbeddingsForProducts(
  productBatch: Array<{
    id: string;
    title: string;
    description: string | null;
    tags: string[] | null;
  }>,
) {
  console.log(
    `Generating embeddings for batch of ${productBatch.length} products...`,
  );

  const embeddings: Array<{
    productId: string;
    embedding: number[];
  }> = [];

  for (const product of productBatch) {
    try {
      // Create a rich text representation for embedding
      const textForEmbedding = createEmbeddingText(product);

      console.log(`Generating embedding for product: ${product.title}`);

      const result = await embed({
        model: EMBEDDING_CONFIG.model,
        value: textForEmbedding,
        providerOptions: {
          google: {
            outputDimensionality: EMBEDDING_CONFIG.outputDimensionality,
          },
        },
      });

      embeddings.push({
        productId: product.id,
        embedding: result.embedding,
      });

      // Small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(
        `Failed to generate embedding for product ${product.id}:`,
        error,
      );
      throw error;
    }
  }

  return embeddings;
}

/**
 * Creates a rich text representation of a product for embedding generation.
 */
function createEmbeddingText(product: {
  title: string;
  description: string | null;
  tags: string[] | null;
}): string {
  const parts = [product.title];

  if (product.description) {
    parts.push(product.description);
  }

  if (product.tags && product.tags.length > 0) {
    parts.push(`Tags: ${product.tags.join(", ")}`);
  }

  return parts.join(" ");
}

/**
 * Updates products with their generated embeddings.
 */
async function updateProductsWithEmbeddings(
  embeddings: Array<{
    productId: string;
    embedding: number[];
  }>,
) {
  const db = drizzleDbClient();

  console.log(`Updating ${embeddings.length} products with embeddings...`);

  for (const { productId, embedding } of embeddings) {
    try {
      await db
        .update(products)
        .set({
          embedding: embedding,
          updatedAt: new Date(),
        })
        .where(eq(products.id, productId));

      console.log(`Updated product ${productId} with embedding`);
    } catch (error) {
      console.error(`Failed to update product ${productId}:`, error);
    }
  }
}

/**
 * Main execution function.
 */
async function main() {
  try {
    console.log("Starting embedding generation process...");

    // Validate environment
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL environment variable is required. Please make sure your .env file contains a valid DATABASE_URL.",
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }

    // Get products without embeddings
    const productsWithoutEmbeddings = await getProductsWithoutEmbeddings();

    if (productsWithoutEmbeddings.length === 0) {
      console.log("No products found without embeddings. Exiting.");
      return;
    }

    // Process in batches
    const batches = [];
    for (
      let i = 0;
      i < productsWithoutEmbeddings.length;
      i += EMBEDDING_CONFIG.batchSize
    ) {
      batches.push(
        productsWithoutEmbeddings.slice(i, i + EMBEDDING_CONFIG.batchSize),
      );
    }

    console.log(
      `Processing ${batches.length} batches of up to ${EMBEDDING_CONFIG.batchSize} products each`,
    );

    for (let i = 0; i < batches.length; i++) {
      console.log(`Processing batch ${i + 1}/${batches.length}`);

      const batch = batches[i];
      const embeddings = await generateEmbeddingsForProducts(batch);
      await updateProductsWithEmbeddings(embeddings);

      // Longer delay between batches to avoid rate limits
      if (i < batches.length - 1) {
        console.log("Waiting 2 seconds before next batch...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log("Embedding generation process completed successfully!");
  } catch (error) {
    console.error("Fatal error during embedding generation:", error);
    process.exit(1);
  }
}

// Execute the script
main()
  .catch((error) => {
    console.error("Fatal error during embedding generation:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
