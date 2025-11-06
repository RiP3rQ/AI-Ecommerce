import { type ToolSet } from "ai";
import { suggestProductsTool } from "./tools/suggest-products";
import { getMostLikedProductsTool } from "./tools/most-liked-products";
import { getProductsByCategoryTool } from "./tools/products-by-category";
import { getAllCategoriesTool } from "./tools/all-categories";
import { searchProductsByTagsTool } from "./tools/search-by-tags";
import { getProductDetailsTool } from "./tools/product-details";
import { getProductReviewsTool } from "./tools/product-reviews";
import { searchProductsByNameTool } from "./tools/search-by-name";

const toolsWithoutCart = {
  getMostLikedProducts: getMostLikedProductsTool,
  getProductsByCategory: getProductsByCategoryTool,
  getAllCategories: getAllCategoriesTool,
  searchProductsByTags: searchProductsByTagsTool,
  getProductDetails: getProductDetailsTool,
  getProductReviews: getProductReviewsTool,
  searchProductsByName: searchProductsByNameTool,
};

export function getToolsWithoutSuggestProducts(): ToolSet {
  return toolsWithoutCart;
}

const allTools = {
  ...{ ...getToolsWithoutSuggestProducts() },
  suggestProducts: suggestProductsTool,
};

export function getAiTools(): ToolSet {
  return allTools;
}
