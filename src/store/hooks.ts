import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { CartRootState, CartAppDispatch } from "./index";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<CartAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<CartRootState> = useSelector;
