import React from "react";

export interface BadgeProps {
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children }) => {
  return <span>{children}</span>;
};

export default Badge;
