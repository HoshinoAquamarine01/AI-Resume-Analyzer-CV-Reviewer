import React from "react";

export interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedRoute;
