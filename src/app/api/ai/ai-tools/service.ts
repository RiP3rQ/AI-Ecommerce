import { getAiTools } from "@/ai/tools";
import { AiToolCategory, type AiToolDto } from "./dto";

/**
 * Service class for handling AI tools listing operations
 */
export class AiToolsService {
  /**
   * Retrieves all available AI tools with user-friendly descriptions
   *
   * @returns Array of AI tools with their names and descriptions
   */
  public getAllTools(): AiToolDto[] {
    const toolsObject = getAiTools();

    // Map technical tool names to user-friendly names, descriptions, and categories
    const toolMappings: Record<
      string,
      { name: string; description: string; category: AiToolCategory }
    > = {
      // Product discovery tools
      getMostLikedProducts: {
        name: "Popular Products",
        description:
          "Discover the most liked and popular products in our store",
        category: AiToolCategory.PRODUCT_DISCOVERY,
      },
      getProductsByCategory: {
        name: "Browse by Category",
        description:
          "Find products within specific categories like clothing, accessories, or shoes",
        category: AiToolCategory.PRODUCT_DISCOVERY,
      },
      getAllCategories: {
        name: "Shop Categories",
        description: "Explore all available product categories in our store",
        category: AiToolCategory.PRODUCT_DISCOVERY,
      },
      searchProductsByTags: {
        name: "Search by Tags",
        description: "Find products using specific tags or keywords",
        category: AiToolCategory.PRODUCT_DISCOVERY,
      },
      getProductDetails: {
        name: "Product Information",
        description: "Get detailed information about any specific product",
        category: AiToolCategory.PRODUCT_DISCOVERY,
      },
      getProductReviews: {
        name: "Customer Reviews",
        description: "Read customer reviews and ratings for products",
        category: AiToolCategory.PRODUCT_DISCOVERY,
      },
      searchProductsByName: {
        name: "Search Products",
        description: "Search for products by name or description",
        category: AiToolCategory.PRODUCT_DISCOVERY,
      },
      // Cart management tools
      getCartDetails: {
        name: "View Shopping Cart",
        description: "Check what's currently in your shopping cart",
        category: AiToolCategory.CART_MANAGEMENT,
      },
      removeFromCart: {
        name: "Remove from Cart",
        description: "Remove items from your shopping cart",
        category: AiToolCategory.CART_MANAGEMENT,
      },
      addToCartProductInformations: {
        name: "Add to Cart - Get Options",
        description:
          "Start the process of adding products to cart by exploring available options",
        category: AiToolCategory.CART_MANAGEMENT,
      },
      clientSideConfirmationForCartModification: {
        name: "Add to Cart - Select Options",
        description:
          "Choose your preferred product variants like size and color",
        category: AiToolCategory.CART_MANAGEMENT,
      },
      saveTheFrontendSelectedProductToCart: {
        name: "Add to Cart - Confirm",
        description: "Finalize adding your selected products to the cart",
        category: AiToolCategory.CART_MANAGEMENT,
      },
      revalidateFrontendCart: {
        name: "Update Cart Display",
        description: "Refresh your cart to show the latest changes",
        category: AiToolCategory.CART_MANAGEMENT,
      },
      // Outfit and styling tools
      comboOutfit: {
        name: "Complete Your Outfit",
        description:
          "Get outfit suggestions that match a specific item you like",
        category: AiToolCategory.OUTFIT_STYLING,
      },
      // Product recommendations
      suggestProducts: {
        name: "Smart Recommendations",
        description:
          "Get personalized product suggestions based on your cart items",
        category: AiToolCategory.PRODUCT_RECOMMENDATIONS,
      },
    };

    // Extract tools from the tools object and map to user-friendly format
    return Object.keys(toolsObject).map((key) => {
      const mapping = toolMappings[key];
      if (!mapping) {
        // Fallback for any unmapped tools
        return {
          name: key,
          description: `Tool: ${key}`,
          category: AiToolCategory.PRODUCT_DISCOVERY, // Default category for unmapped tools
        };
      }
      return mapping;
    });
  }
}

export const aiToolsService = new AiToolsService();
