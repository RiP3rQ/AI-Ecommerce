import { tool, zodSchema, type ToolSet } from "ai";
import z from "zod";
import { findSimilarProducts } from "./tool-helpers/suggest-products";
import {
  getAllCategories,
  getProductsByCategory,
  getMostLikedProducts,
  searchProductsByTags,
  getProductDetails,
  getProductReviews,
} from "./tool-helpers/product-tools";

export function getAiTools(): ToolSet | undefined {
  return {
    suggestProducts: tool({
      description:
        "Suggest products similar to items in the user's cart using AI embeddings",
      inputSchema: zodSchema(
        z.object({
          cartItems: z.array(
            z.object({
              productId: z.string().uuid("Invalid product ID format"),
              quantity: z.number(),
              productTitle: z.string(),
            }),
          ),
        }),
      ),
      execute: async (args) => {
        const similarProducts = await findSimilarProducts(args.cartItems);

        return {
          suggestions: similarProducts.map((product) => ({
            id: product.id,
            title: product.title,
            description: product.description,
            tags: product.tags,
            relevanceScore: product.similarity,
          })),
          totalSuggestions: similarProducts.length,
        };
      },
    }),

    getMostLikedProducts: tool({
      description:
        "Get the most liked products based on customer reviews and ratings",
      inputSchema: zodSchema(
        z.object({
          limit: z.number().min(1).max(50).default(10).optional(),
        }),
      ),
      execute: async (args) => {
        const products = await getMostLikedProducts(args.limit || 10);

        return {
          products: products.map((product) => ({
            id: product.id,
            title: product.title,
            description: product.description,
            tags: product.tags,
            averageRating: product.averageRating,
            reviewCount: product.reviewCount,
          })),
          totalProducts: products.length,
        };
      },
    }),

    getProductsByCategory: tool({
      description: "Get all products from a specific category",
      inputSchema: zodSchema(
        z.object({
          categoryName: z.string().min(1, "Category name cannot be empty"),
          limit: z.number().min(1).max(50).default(20).optional(),
        }),
      ),
      execute: async (args) => {
        const products = await getProductsByCategory(
          args.categoryName,
          args.limit || 20,
        );

        return {
          products: products.map((product) => ({
            id: product.id,
            title: product.title,
            description: product.description,
            tags: product.tags,
          })),
          totalProducts: products.length,
          categoryName: args.categoryName,
        };
      },
    }),

    getAllCategories: tool({
      description: "Get all available product categories in the store",
      inputSchema: zodSchema(z.object({})),
      execute: async () => {
        const categories = await getAllCategories();

        return {
          categories: categories.map((category) => ({
            id: category.id,
            name: category.name,
            description: category.description,
          })),
          totalCategories: categories.length,
        };
      },
    }),

    searchProductsByTags: tool({
      description:
        "Search for products by tags (e.g., 'hoodie', 'black', 'cotton')",
      inputSchema: zodSchema(
        z.object({
          tags: z
            .array(z.string().min(1))
            .min(1, "At least one tag is required"),
          limit: z.number().min(1).max(50).default(20).optional(),
        }),
      ),
      execute: async (args) => {
        const products = await searchProductsByTags(
          args.tags,
          args.limit || 20,
        );

        return {
          products: products.map((product) => ({
            id: product.id,
            title: product.title,
            description: product.description,
            tags: product.tags,
          })),
          totalProducts: products.length,
          searchedTags: args.tags,
        };
      },
    }),

    getProductDetails: tool({
      description:
        "Get detailed information about a specific product including reviews and category",
      inputSchema: zodSchema(
        z.object({
          productId: z.string().uuid("Invalid product ID format"),
        }),
      ),
      execute: async (args) => {
        const product = await getProductDetails(args.productId);

        if (!product) {
          return { product: null, found: false };
        }

        return {
          product: {
            id: product.id,
            title: product.title,
            description: product.description,
            tags: product.tags,
            category: product.category,
            reviewSummary: product.reviewSummary,
            averageRating: product.averageRating,
            reviewCount: product.reviewCount,
          },
          found: true,
        };
      },
    }),

    getProductReviews: tool({
      description: "Get customer reviews for a specific product",
      inputSchema: zodSchema(
        z.object({
          productId: z.string().uuid("Invalid product ID format"),
          limit: z.number().min(1).max(20).default(5).optional(),
        }),
      ),
      execute: async (args) => {
        const reviews = await getProductReviews(
          args.productId,
          args.limit || 5,
        );

        return {
          reviews: reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            content: review.content,
            createdAt: review.createdAt.toISOString(),
          })),
          totalReviews: reviews.length,
          productId: args.productId,
        };
      },
    }),
  };
}
