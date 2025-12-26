import { Navigate, useLocation } from "react-router-dom";
import { Role, useAuth } from "./AuthContext";
import type { ReactNode } from "react";

type RequireAuthProps = {
  allowedRoles: Role[];
  children: ReactNode;
};

export function RequireAuth({ allowedRoles, children }: RequireAuthProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
