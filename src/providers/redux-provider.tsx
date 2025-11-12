"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { cartStore } from "@/store";

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps): ReactNode {
  return <Provider store={cartStore}>{children}</Provider>;
}
