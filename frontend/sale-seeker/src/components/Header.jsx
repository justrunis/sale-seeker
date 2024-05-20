import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosCart, IoIosHome } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { FaRegMoon, FaRegSun, FaBox } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginActions } from "../store/slices/loginSlice";
import { cartActions } from "../store/slices/cartSlice";
import { toast } from "react-toastify";
import { getToken, getUserRole, getExpiration } from "../auth/auth";
import { FcAbout } from "react-icons/fc";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track menu open/close

  const [isLoggedIn, setIsLoggedIn] = useState(
    useSelector((state) => state.login.isLoggedIn)
  );

  const [theme, setTheme] = useState(localStorage.getItem("sale-seeker-theme"));

  // Set theme on page load
  useEffect(() => {
    const theme = localStorage.getItem("sale-seeker-theme");
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, []);

  // Check if token is expired
  useEffect(() => {
    const expiration = getExpiration(getToken());
    if (expiration && expiration < Date.now() / 1000) {
      dispatch(loginActions.logout());
      setIsLoggedIn(false);
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  }, [isLoggedIn]);

  function changeTheme() {
    const root = document.documentElement;
    const theme = root.getAttribute("data-theme");

    if (
      theme === "halloween" ||
      localStorage.getItem("sale-seeker-theme") === "halloween"
    ) {
      root.setAttribute("data-theme", "emerald");
      localStorage.setItem("sale-seeker-theme", "emerald");
      setTheme("emerald");
    } else {
      root.setAttribute("data-theme", "halloween");
      localStorage.setItem("sale-seeker-theme", "halloween");
      setTheme("halloween");
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
      <Link to="/home" className="text-white text-2xl font-bold ml-5">
        Sale Seeker
      </Link>
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
          <li>
            <Link
              to="/home"
              className="text-white hover:text-gray-300 flex items-center gap-1"
            >
              <IoIosHome />
              Home
            </Link>
          </li>
          {isLoggedIn && (
            <>
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
              {["seller", "admin"].includes(getUserRole(getToken())) && (
                <li>
                  <Link
                    to="/my-items"
                    className="text-white hover:text-gray-300 flex items-center gap-1"
                  >
                    <FaBox />
                    My Items
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
          <li>
            <Link
              to="/about"
              className="text-white hover:text-gray-300 flex items-center gap-1"
            >
              <FcAbout />
              About
            </Link>
          </li>
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
            <button
              className="text-white hover:text-gray-300"
              onClick={changeTheme}
            >
              {theme === "halloween" ? <FaRegMoon /> : <FaRegSun />}
            </button>
          </div>
        </ul>
      </nav>
    </header>
  );
}
