import React from "react";
import { Link } from "react-router-dom";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { IoIosCart, IoIosHome } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginActions } from "../store/slices/loginSlice";
import { cartActions } from "../store/slices/cartSlice";
import { toast } from "react-toastify";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);

  function changeTheme() {
    const root = document.documentElement;
    const theme = root.getAttribute("data-theme");

    if (theme === "dark") {
      root.setAttribute("data-theme", "emerald");
    } else {
      root.setAttribute("data-theme", "dark");
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
    <header className="bg-primary py-4 text-neutral-content">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Sale Seeker</h1>
        <nav>
          <ul className="flex space-x-4">
            {isLoggedIn && (
              <>
                <li>
                  <Link to="/home" className="text-white hover:text-gray-300">
                    <IoIosHome />
                  </Link>
                </li>
                <li>
                  <span className="flex flex-column">
                    <Link
                      onClick={handleShowCart}
                      className="text-white hover:text-gray-300"
                    >
                      <IoIosCart />
                    </Link>
                    <p className="text-white hover:text-gray-300">
                      {useSelector((state) => state.cart.items.length)}
                    </p>
                  </span>
                </li>
                <li>
                  <Link
                    onClick={handleLogout}
                    className="text-white hover:text-gray-300"
                    to="/login"
                  >
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
            <label className="swap swap-rotate">
              <input type="checkbox" onChange={changeTheme} />
              <RiMoonFill className="swap-on text-white hover:text-gray-300" />
              <RiSunFill className="swap-off text-white hover:text-gray-300" />
            </label>
          </ul>
        </nav>
      </div>
    </header>
  );
}
