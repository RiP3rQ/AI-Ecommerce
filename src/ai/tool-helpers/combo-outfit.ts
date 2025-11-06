import { embed } from "ai";
import { drizzleDbClient } from "@/database";
import { products } from "@/database/schema";
import { geminiProvider } from "../gemini-provider";
import {
  cosineDistance,
  desc,
  gt,
  and,
  sql,
  not,
  inArray,
  eq,
} from "drizzle-orm";

/**
 * Configuration for outfit embedding similarity search.
 */
const OUTFIT_CONFIG = {
  model: geminiProvider.textEmbeddingModel("gemini-embedding-001"),
  outputDimensionality: 1536,
  similarityThreshold: 0.25, // Lower threshold for broader outfit suggestions
  maxSuggestions: 12, // More suggestions for outfit combinations
} as const;

/**
 * Outfit categories for different clothing types.
 */
const OUTFIT_CATEGORIES = {
  TOPS: ["hoodie", "t-shirt", "shirt", "jacket", "sweater", "blouse"],
  BOTTOMS: ["pants", "jeans", "shorts", "skirt", "leggings"],
  SHOES: ["sneakers", "boots", "sandals", "heels", "loafers"],
  ACCESSORIES: ["hat", "cap", "scarf", "belt", "watch", "jewelry", "bag"],
} as const;

/**
 * Creates a rich text representation of a base item for outfit embedding generation.
 */
function createOutfitEmbeddingText(baseItem: {
  productTitle: string;
  productDescription?: string | null;
  tags?: string[] | null;
}): string {
  const parts = [baseItem.productTitle];

  if (baseItem.productDescription) {
    parts.push(baseItem.productDescription);
  }

  if (baseItem.tags && baseItem.tags.length > 0) {
    parts.push(`Tags: ${baseItem.tags.join(", ")}`);
  }

  return `Outfit base item: ${parts.join(" ")}`;
}

/**
 * Determines which outfit categories to suggest based on the base item.
 */
function getOutfitCategoryToSuggest(baseItem: {
  productTitle: string;
  tags?: string[] | null;
}): string[] {
  const title = baseItem.productTitle.toLowerCase();
  const tags = baseItem.tags || [];

  // Check if base item is a top
  const isTop = OUTFIT_CATEGORIES.TOPS.some(
    (category) =>
      title.includes(category) ||
      tags.some((tag) => tag.toLowerCase().includes(category)),
  );

  // Check if base item is bottoms
  const isBottom = OUTFIT_CATEGORIES.BOTTOMS.some(
    (category) =>
      title.includes(category) ||
      tags.some((tag) => tag.toLowerCase().includes(category)),
  );

  // Check if base item is shoes
  const isShoes = OUTFIT_CATEGORIES.SHOES.some(
    (category) =>
      title.includes(category) ||
      tags.some((tag) => tag.toLowerCase().includes(category)),
  );

  // Determine what to suggest based on what's already provided
  if (isTop) {
    return ["bottoms", "shoes", "accessories"];
  } else if (isBottom) {
    return ["tops", "shoes", "accessories"];
  } else if (isShoes) {
    return ["tops", "bottoms", "accessories"];
  } else {
    // Default to suggesting everything if category unclear
    return ["tops", "bottoms", "shoes", "accessories"];
  }
}

/**
 * Finds products that would complete an outfit for a given base item using embeddings.
 */
export async function findOutfitCombinations(baseItem: {
  productId: string;
  productTitle: string;
}): Promise<
  Array<{
    id: string;
    title: string;
    description?: string | null;
    tags: string[] | null;
    similarity: number;
    outfitCategory: string;
  }>
> {
  console.log("Executing findOutfitCombinations...");
  const db = drizzleDbClient();

  // Create embedding text from base item
  console.log("Creating outfit embedding text...");
  const outfitText = createOutfitEmbeddingText(baseItem);

  try {
    // Generate embedding for the base item
    const result = await embed({
      model: OUTFIT_CONFIG.model,
      value: outfitText,
      providerOptions: {
        google: {
          outputDimensionality: OUTFIT_CONFIG.outputDimensionality,
        },
      },
    });

    console.log("Generated embedding for the base item...");

    const baseEmbedding = result.embedding;

    // Find similar products using cosine similarity
    const similarity = sql<number>`1 - (${cosineDistance(
      products.embedding,
      baseEmbedding,
    )})`;

    // Determine which categories to suggest
    const categoriesToSuggest = getOutfitCategoryToSuggest(baseItem);
    console.log("Categories to suggest:", categoriesToSuggest);

    // Build category conditions - products that match any of the suggested categories
    const categoryConditions = categoriesToSuggest.flatMap((category) => {
      const categoryTags =
        OUTFIT_CATEGORIES[
          category.toUpperCase() as keyof typeof OUTFIT_CATEGORIES
        ];
      return categoryTags.map(
        (tag) => sql`LOWER(${products.tags}::text) LIKE LOWER(${`%${tag}%`})`,
      );
    });

    // Build where conditions
    const whereConditions = [
      gt(similarity, OUTFIT_CONFIG.similarityThreshold),
      eq(products.availableForSale, true),
      // Exclude the base item itself
      not(eq(products.id, baseItem.productId)),
      // Include products that match the suggested categories
      sql`(${sql.join(categoryConditions, sql` OR `)})`,
    ];

    console.log("Fetching outfit combinations...");

    const outfitProducts = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        tags: products.tags,
        similarity,
      })
      .from(products)
      .where(and(...whereConditions))
      .orderBy(desc(similarity))
      .limit(OUTFIT_CONFIG.maxSuggestions);

    console.log("Outfit combinations fetched...");
    console.log("outfitProducts", outfitProducts);

    // Add outfit category information to results
    const resultsWithCategories = outfitProducts.map((product) => {
      const tags = product.tags || [];
      const title = product.title.toLowerCase();

      let outfitCategory = "accessories"; // default

      if (
        OUTFIT_CATEGORIES.TOPS.some(
          (cat) =>
            title.includes(cat) ||
            tags.some((tag) => tag.toLowerCase().includes(cat)),
        )
      ) {
        outfitCategory = "tops";
      } else if (
        OUTFIT_CATEGORIES.BOTTOMS.some(
          (cat) =>
            title.includes(cat) ||
            tags.some((tag) => tag.toLowerCase().includes(cat)),
        )
      ) {
        outfitCategory = "bottoms";
      } else if (
        OUTFIT_CATEGORIES.SHOES.some(
          (cat) =>
            title.includes(cat) ||
            tags.some((tag) => tag.toLowerCase().includes(cat)),
        )
      ) {
        outfitCategory = "shoes";
      }

      return {
        ...product,
        outfitCategory,
      };
    });

    return resultsWithCategories;
  } catch (error) {
    console.error("Error finding outfit combinations:", error);
    // Return empty array on error to prevent breaking the AI flow
    return [];
  }
}
