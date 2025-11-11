import { getAiTools } from '@/ai/tools';
import type { AiToolDto } from './dto';

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

    // Map technical tool names to user-friendly names and descriptions
    const toolMappings: Record<string, { name: string; description: string }> = {
      // Product search and discovery tools
      getMostLikedProducts: {
        name: 'Popular Products',
        description: 'Discover the most liked and popular products in our store'
      },
      getProductsByCategory: {
        name: 'Browse by Category',
        description: 'Find products within specific categories like clothing, accessories, or shoes'
      },
      getAllCategories: {
        name: 'Shop Categories',
        description: 'Explore all available product categories in our store'
      },
      searchProductsByTags: {
        name: 'Search by Tags',
        description: 'Find products using specific tags or keywords'
      },
      getProductDetails: {
        name: 'Product Information',
        description: 'Get detailed information about any specific product'
      },
      getProductReviews: {
        name: 'Customer Reviews',
        description: 'Read customer reviews and ratings for products'
      },
      searchProductsByName: {
        name: 'Search Products',
        description: 'Search for products by name or description'
      },
      // Cart management tools
      getCartDetails: {
        name: 'View Shopping Cart',
        description: 'Check what\'s currently in your shopping cart'
      },
      removeFromCart: {
        name: 'Remove from Cart',
        description: 'Remove items from your shopping cart'
      },
      // Outfit and styling tools
      comboOutfit: {
        name: 'Complete Your Outfit',
        description: 'Get outfit suggestions that match a specific item you like'
      },
      // Product recommendations
      suggestProducts: {
        name: 'Smart Recommendations',
        description: 'Get personalized product suggestions based on your cart items'
      },
      // Add to cart flow tools
      addToCartProductInformations: {
        name: 'Add to Cart - Get Options',
        description: 'Start the process of adding products to cart by exploring available options'
      },
      clientSideConfirmationForCartModification: {
        name: 'Add to Cart - Select Options',
        description: 'Choose your preferred product variants like size and color'
      },
      saveTheFrontendSelectedProductToCart: {
        name: 'Add to Cart - Confirm',
        description: 'Finalize adding your selected products to the cart'
      },
      revalidateFrontendCart: {
        name: 'Update Cart Display',
        description: 'Refresh your cart to show the latest changes'
      }
    };

    // Extract tools from the tools object and map to user-friendly format
    return Object.keys(toolsObject).map(key => {
      const mapping = toolMappings[key];
      if (!mapping) {
        // Fallback for any unmapped tools
        return {
          name: key,
          description: `Tool: ${key}`
        };
      }
      return mapping;
    });
  }
}

export const aiToolsService = new AiToolsService();
