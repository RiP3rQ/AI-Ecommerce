import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart-slice";

export const cartStore = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type CartRootState = ReturnType<typeof cartStore.getState>;
export type CartAppDispatch = typeof cartStore.dispatch;
