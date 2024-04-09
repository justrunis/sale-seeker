import React from "react";
import { Link } from "react-router-dom";
import { IoIosCart, IoIosHome } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { RiAdminFill } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginActions } from "../store/slices/loginSlice";
import { cartActions } from "../store/slices/cartSlice";
import { toast } from "react-toastify";
import { getToken, getUserRole } from "../auth/auth";

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
              {getUserRole(getToken()) === "admin" && (
                <li>
                  <Link
                    to="/admin"
                    className="text-white hover:text-gray-300 flex flex-column items-center gap-1"
                  >
                    Admin
                    <RiAdminFill />
                  </Link>
                </li>
              )}
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
          <label
            htmlFor="menu-toggle"
            className="block lg:hidden cursor-pointer"
          >
            <svg
              className="fill-current text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              width="20"
              height="20"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </label>
          <input className="hidden" type="checkbox" id="menu-toggle" />
          <div className="hidden lg:flex lg:items-center lg:w-auto lg:space-x-4">
            <label className="swap swap-rotate inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                onChange={changeTheme}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </ul>
      </nav>
    </header>
  );
}
