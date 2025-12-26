import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export default function HomeRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.role === "admin" ? "/admin" : "/customer"} replace />;
}
