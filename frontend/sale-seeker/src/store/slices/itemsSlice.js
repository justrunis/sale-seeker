import { createSlice } from "@reduxjs/toolkit";

const initialItemsState = {
  items: [],
  loading: false,
  error: null,
};

const itemsSlice = createSlice({
  name: "items",
  initialState: initialItemsState,
  reducers: {
    fetchItemsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchItemsSuccess(state, action) {
      state.items = action.payload;
      state.loading = false;
    },
    fetchItemsFail(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setItems(state, action) {
      state.items = action.payload;
    },
  },
});

export const itemsActions = itemsSlice.actions;

export default itemsSlice.reducer;
