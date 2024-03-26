import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";
import cartReducer from "./slices/cartSlice";
import itemsReducer from "./slices/itemsSlice";

const store = configureStore({
  reducer: {
    login: loginReducer,
    cart: cartReducer,
    items: itemsReducer,
  },
});

export default store;
