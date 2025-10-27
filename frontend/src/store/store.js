import { configureStore } from "@reduxjs/toolkit";
import purchaseReducer from "../features/purchaseSlice";
import authReducer from "../features/authSlice";

export const store = configureStore({
  reducer: {
    purchases: purchaseReducer,
    auth: authReducer,
  },
});
