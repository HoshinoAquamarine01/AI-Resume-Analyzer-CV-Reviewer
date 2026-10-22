import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();


  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    const message = location.pathname.startsWith("/settings")
      ? "Please log in to access your Settings & Profile."
      : "Please log in to access this page.";
    toast.error(message, { id: "auth-redirect-toast" });

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
