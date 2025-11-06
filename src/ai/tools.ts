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
import { addToCartTool } from "./tools/add-to-cart";
import { confirmAddToCartTool } from "./tools/confirm-add-to-cart";

const toolsWithoutSuggestProducts = {
  getMostLikedProducts: getMostLikedProductsTool,
  getProductsByCategory: getProductsByCategoryTool,
  getAllCategories: getAllCategoriesTool,
  searchProductsByTags: searchProductsByTagsTool,
  getProductDetails: getProductDetailsTool,
  getProductReviews: getProductReviewsTool,
  searchProductsByName: searchProductsByNameTool,
  getCartDetails: getCartDetailsTool,
  comboOutfit: comboOutfitTool,
  addToCart: addToCartTool,
  confirmAddToCart: confirmAddToCartTool,
};

export function getToolsWithoutSuggestProducts(): ToolSet {
  return toolsWithoutSuggestProducts;
}

const allTools = {
  ...{ ...getToolsWithoutSuggestProducts() },
  suggestProducts: suggestProductsTool,
};

export function getAiTools(): ToolSet {
  return allTools;
}
