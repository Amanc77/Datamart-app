import { configureStore } from "@reduxjs/toolkit";
import purchaseReducer from "../features/purchaseSlice";

export const store = configureStore({
  reducer: {
    purchases: purchaseReducer,
  },
});
