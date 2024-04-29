import { createSlice } from "@reduxjs/toolkit";

const initialCartState = {
  items: [],
  totalQuantity: 0,
  changed: false,
  show: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    replaceCart(state, action) {
      state.totalQuantity = action.payload.totalQuantity;
      state.items = action.payload.items;
    },
    addItemToCart(state, action) {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);
      if (!existingItem) {
        state.items.push({
          id: item.id,
          title: item.title,
          price: parseFloat(item.price),
          quantity: 1,
          totalPrice: parseFloat(item.price),
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += parseFloat(item.price);
      }
      state.totalQuantity++;
      state.changed = true;
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      state.totalQuantity--;
      state.changed = true;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    },
    showCart(state) {
      state.show = true;
    },
    hideCart(state) {
      state.show = false;
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
    },
    getTotalPrice(state) {
      let totalPrice = 0;
      state.items.forEach((item) => {
        totalPrice += item.totalPrice;
      });
      return totalPrice;
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
