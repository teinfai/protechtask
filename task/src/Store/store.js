// store.js
import { configureStore } from "@reduxjs/toolkit";
import callReducer from "./reduxjs/call";
import cartReducer from "./reduxjs/cart";

const store = configureStore({
  reducer: {
    call: callReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
