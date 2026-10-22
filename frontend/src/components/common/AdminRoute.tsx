import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const location = useLocation();

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const storedUserRaw = localStorage.getItem("user") || sessionStorage.getItem("user");

  let userRole = "user";
  if (storedUserRaw) {
    try {
      const parsed = JSON.parse(storedUserRaw);
      userRole = parsed.role || "user";
    } catch {
      userRole = "user";
    }
  }

  
  if (!token) {
    toast.error("Please login with an Admin account to access Admin Control Center.", {
      id: "admin-auth-redirect",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole !== "admin") {
    toast.error("Access denied. Admin privileges required.", {
      id: "admin-forbidden-redirect",
    });
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
