import { type ToolSet } from "ai";
import { suggestProductsTool } from "./tools/suggest-products";
import { getMostLikedProductsTool } from "./tools/most-liked-products";
import { getProductsByCategoryTool } from "./tools/products-by-category";
import { getAllCategoriesTool } from "./tools/all-categories";
import { searchProductsByTagsTool } from "./tools/search-by-tags";
import { getProductDetailsTool } from "./tools/product-details";
import { getProductReviewsTool } from "./tools/product-reviews";
import { searchProductsByNameTool } from "./tools/search-by-name";
import { getCartDetailsTool } from "./tools/get-cart-details";
import { comboOutfitTool } from "./tools/combo-outfit";
import { addToCartProductInformationsTool } from "./tools/add-to-cart-product-informations";
import { clientSideConfirmationForCartModificationTool } from "./tools/return-information-for-confirming-cart-modification";
import { saveTheFrontendSelectedProductToCartTool } from "./tools/confirm-add-to-cart";
import { revalidateFrontendCartTool } from "./tools/revalidate-frontend-cart";
import { removeFromCartTool } from "./tools/remove-from-cart";

const allToolsObject = {
  // GENERAL PRODUCTS TOOLS
  getMostLikedProducts: getMostLikedProductsTool,
  getProductsByCategory: getProductsByCategoryTool,
  getAllCategories: getAllCategoriesTool,
  searchProductsByTags: searchProductsByTagsTool,
  getProductDetails: getProductDetailsTool,
  getProductReviews: getProductReviewsTool,
  searchProductsByName: searchProductsByNameTool,
  // CART TOOLS
  getCartDetails: getCartDetailsTool,
  removeFromCart: removeFromCartTool,
  // COMBO TOOL FOR GENERATING OUTFIT COMBINATIONS
  comboOutfit: comboOutfitTool,
  // SUGGEST PRODUCTS TOOL BASED ON THE CART ITEMS - RAG
  suggestProducts: suggestProductsTool,
  // ADD-TO-CART FLOW (4 STEPS):
  // Step 1: [SERVER] Get product details with all available variants
  addToCartProductInformations: addToCartProductInformationsTool,
  // Step 2: [CLIENT] Show modal for user to select variants and quantities
  clientSideConfirmationForCartModification:
    clientSideConfirmationForCartModificationTool,
  // Step 3: [SERVER] Save the selected variants to the cart
  saveTheFrontendSelectedProductToCart:
    saveTheFrontendSelectedProductToCartTool,
  // Step 4: [CLIENT] Revalidate frontend cart items
  revalidateFrontendCart: revalidateFrontendCartTool,
};

export function getSuggestProductsTools(): ToolSet {
  return {
    // THE ACTUAL SUGGEST PRODUCTS TOOL BASED ON THE CART ITEMS - RAG
    suggestProducts: suggestProductsTool,
  };
}

export function getAiTools(): ToolSet {
  return allToolsObject;
}
