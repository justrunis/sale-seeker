import { createSlice } from "@reduxjs/toolkit";

const initialCheckoutState = {
  show: false,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: initialCheckoutState,
  reducers: {
    showCheckout(state) {
      state.show = true;
    },
    hideCheckout(state) {
      state.show = false;
    },
    toggleCheckout(state) {
      state.show = !state.show;
    },
  },
});

export const checkoutActions = checkoutSlice.actions;

export default checkoutSlice.reducer;
