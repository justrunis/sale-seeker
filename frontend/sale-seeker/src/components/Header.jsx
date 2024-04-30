import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosCart, IoIosHome } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track menu open/close

  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);

  useEffect(() => {
    const theme = localStorage.getItem("sale-seeker-theme");
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, []);

  function changeTheme() {
    const root = document.documentElement;
    const theme = root.getAttribute("data-theme");

    if (
      theme === "halloween" ||
      localStorage.getItem("sale-seeker-theme") === "halloween"
    ) {
      root.setAttribute("data-theme", "emerald");
      localStorage.setItem("sale-seeker-theme", "emerald");
    } else {
      root.setAttribute("data-theme", "halloween");
      localStorage.setItem("sale-seeker-theme", "halloween");
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
      <div className="lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white hover:text-gray-300 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>
      <nav className={`nav ${isMenuOpen ? "block" : "hidden"} lg:block mr-10`}>
        <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {isLoggedIn && (
            <>
              <li>
                <Link
                  to="/home"
                  className="text-white hover:text-gray-300 flex items-center gap-1"
                >
                  <IoIosHome />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-white hover:text-gray-300 flex items-center gap-1"
                >
                  <CgProfile />
                  Profile
                </Link>
              </li>
              {getUserRole(getToken()) === "admin" && (
                <li>
                  <Link
                    to="/admin"
                    className="text-white hover:text-gray-300 flex items-center gap-1"
                  >
                    <RiAdminFill />
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <Link
                  onClick={handleShowCart}
                  className="text-white hover:text-gray-300 flex items-center gap-1"
                >
                  <IoIosCart />
                  Cart {useSelector((state) => state.cart.items.length)}
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleLogout}
                  className="text-white hover:text-gray-300 flex items-center gap-1"
                  to="/login"
                >
                  <CiLogout />
                  Logout
                </Link>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/" className="text-white hover:text-gray-300">
                  Welcome
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white hover:text-gray-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white hover:text-gray-300">
                  Register
                </Link>
              </li>
            </>
          )}
          {/* Theme toggle */}
          <div className=" lg:flex lg:items-center lg:w-auto lg:space-x-4">
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
