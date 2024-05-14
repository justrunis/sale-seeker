import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "../auth/auth";
import { useSelector } from "react-redux";

const SellerRoute = ({ redirectPath = "/home", children }) => {
  const token = useSelector((state) => state.login.user).token;
  if (getUserRole(token) === "user") {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default SellerRoute;
