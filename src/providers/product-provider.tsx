"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useOptimistic,
} from "react";
import { parseAsInteger, parseAsJson, useQueryState } from "nuqs";
import {
  productUrlSchema,
} from "@/schemas/product-url-schema";

type ProductState = {
  image?: string;
} & Record<string, string | undefined>;

type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => ProductState;
  updateImage: (index: string) => ProductState;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [urlImage, setUrlImage] = useQueryState(
    "image",
    parseAsInteger.withDefault(0),
  );
  const [selectedProductOption, setSelectedProductOption] = useQueryState(
    "selectedProductOption",
    parseAsJson(productUrlSchema),
  );

  const getInitialState = () => {
    const params: ProductState = {
      image: urlImage.toString(),
      ...selectedProductOption,
    };
    return params;
  };

  const [state, setOptimisticState] = useOptimistic(
    getInitialState(),
    (prevState: ProductState, update: ProductState) => ({
      ...prevState,
      ...update,
    }),
  );

  const updateOption = (name: string, value: string) => {
    const newState = { [name]: value };
    setOptimisticState(newState);
    setSelectedProductOption((prev) => ({ ...prev, [name]: value }));
    return { ...state, ...newState };
  };

  const updateImage = (index: string) => {
    const newState = { image: index };
    setOptimisticState(newState);
    setUrlImage(Number(index));
    return { ...state, ...newState };
  };

  const value = useMemo(
    () => ({
      state,
      updateOption,
      updateImage,
    }),
    [state],
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProductProvider() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProductProvider must be used within a ProductProvider");
  }
  return context;
}
