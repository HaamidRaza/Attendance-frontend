import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Authenticated but not permitted here — send them to their own home
    // instead of bouncing them back to login.
    const fallback = user?.role === "teacher" ? "/attendance" : "/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return children;
}