import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";
import cartReducer from "./slices/cartSlice";
import itemsReducer from "./slices/itemsSlice";
import checkoutReducer from "./slices/checkoutSlice";

const store = configureStore({
  reducer: {
    login: loginReducer,
    cart: cartReducer,
    items: itemsReducer,
    checkout: checkoutReducer,
  },
});

export default store;
