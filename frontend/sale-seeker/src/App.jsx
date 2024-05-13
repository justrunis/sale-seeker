import Home from "./components/pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./components/Cart";
import Item from "./components/pages/Item";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./components/util/http";
import AdminRoute from "./components/AdminRoute";
import Admin from "./components/pages/Admin";
import CheckoutPage from "./components/pages/Checkout";
import Welcome from "./components/pages/Welcome";
import Profile from "./components/pages/Profile";
import ErrorPage from "./components/pages/ErrorPage";
import AboutUs from "./components/pages/AboutUs";
import PasswordReset from "./components/pages/PasswordReset";

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContainer position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/item/:id" element={<Item />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password/:token" element={<PasswordReset />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          <Cart />
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
