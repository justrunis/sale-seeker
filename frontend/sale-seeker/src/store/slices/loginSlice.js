import { createSlice } from "@reduxjs/toolkit";

const parseJsonFromLocalStorage = (key) => {
  const item = localStorage.getItem(key);
  try {
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    return null;
  }
  return null;
};

const initialLoginState = {
  isLoggedIn: !!parseJsonFromLocalStorage("token"),
  user: parseJsonFromLocalStorage("token"),
};

const loginSlice = createSlice({
  name: "login",
  initialState: initialLoginState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
      localStorage.setItem("token", JSON.stringify(action.payload));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const loginActions = loginSlice.actions;

export default loginSlice.reducer;
