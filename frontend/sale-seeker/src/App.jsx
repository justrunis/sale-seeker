import Home from "./components/pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "./auth/auth";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Item from "./components/pages/Item";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./components/util/http";
import AdminRoute from "./components/AdminRoute";
import Admin from "./components/pages/Admin";
import CheckoutPage from "./components/pages/Checkout";

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContainer position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="item/:id" element={<Item />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Cart />
          <Checkout />
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
