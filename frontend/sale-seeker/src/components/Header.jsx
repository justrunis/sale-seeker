import React from "react";
import { Link } from "react-router-dom";
import { IoIosCart, IoIosHome } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginActions } from "../store/slices/loginSlice";
import { cartActions } from "../store/slices/cartSlice";
import { toast } from "react-toastify";
import logo from "../../public/logos/png/logo-color.png";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);

  function changeTheme() {
    const root = document.documentElement;
    const theme = root.getAttribute("data-theme");

    if (theme === "halloween") {
      root.setAttribute("data-theme", "emerald");
    } else {
      root.setAttribute("data-theme", "halloween");
    }
  }

  function handleLogout() {
    dispatch(loginActions.logout());
    toast.success("User logged out.");
    navigate("/login");
  }

  function handleShowCart() {
    if (!isLoggedIn) {
      toast.error("Please login to view cart.");
      return navigate("/login");
    }
    dispatch(cartActions.showCart());
  }

  return (
    <header className="bg-primary py-4 text-neutral-content flex justify-between">
      <h1 className="text-white text-2xl font-bold ml-5">Sale Seeker</h1>
      <nav className="nav mr-10">
        <ul className="flex space-x-4">
          {isLoggedIn && (
            <>
              <li>
                <Link
                  to="/home"
                  className="text-white hover:text-gray-300 flex flex-column items-center gap-1"
                >
                  Home
                  <IoIosHome />
                </Link>
              </li>
              <li>
                <span className="flex flex-column">
                  <Link
                    onClick={handleShowCart}
                    className="text-white hover:text-gray-300 flex flex-column items-center gap-1"
                  >
                    Cart
                    <IoIosCart />
                    {useSelector((state) => state.cart.items.length)}
                  </Link>
                </span>
              </li>
              <li>
                <Link
                  onClick={handleLogout}
                  className="text-white hover:text-gray-300 flex flex-column items-center gap-1"
                  to="/login"
                >
                  Logout
                  <CiLogout />
                </Link>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <li>
              <Link to="/login" className="text-white hover:text-gray-300">
                Login
              </Link>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <Link to="/register" className="text-white hover:text-gray-300">
                Register
              </Link>
            </li>
          )}
          <label className="swap swap-rotate inline-flex items-cente</label>r cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              onChange={changeTheme}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </ul>
      </nav>
    </header>
  );
}
