import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "../auth/auth";

const AdminRoute = ({ redirectPath = "/home", children, token }) => {
  if (getUserRole(token) !== "admin") {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;
