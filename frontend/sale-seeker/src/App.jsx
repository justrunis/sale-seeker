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

function App() {
  const token = getToken();
  return (
    <>
      <ToastContainer position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute token={token} />}>
            <Route path="/home" element={<Home />} />
            <Route path="item/:id" element={<Item />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
      <Cart />
      <Checkout />
    </>
  );
}

export default App;
