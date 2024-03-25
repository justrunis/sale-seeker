import React from "react";
import { Link } from "react-router-dom";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { RiSunLine } from "react-icons/ri";
import { CiSun } from "react-icons/ci";
import { useSelector } from "react-redux";

export default function Header() {
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);

  function changeTheme() {
    const root = document.documentElement;
    const theme = root.getAttribute("data-theme");

    if (theme === "dark") {
      root.setAttribute("data-theme", "cupcake");
    } else {
      root.setAttribute("data-theme", "dark");
    }
  }

  return (
    <header className="bg-primary py-4 text-neutral-content">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Sale Seeker</h1>
        <nav>
          <ul className="flex space-x-4">
            {isLoggedIn && (
              <li>
                <Link to="/" className="text-white hover:text-gray-300">
                  Home
                </Link>
              </li>
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
            <li>
              <label className="swap swap-rotate">
                <input type="checkbox" onChange={changeTheme} />
                <RiMoonFill className="swap-off" />
                <RiSunFill className="swap-on" />
              </label>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
