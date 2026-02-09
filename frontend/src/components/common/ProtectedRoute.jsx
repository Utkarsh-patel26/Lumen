import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";

const ProtectedRoute = ({ children, role }) => {
  const { token, role: userRole, hydrated } = useAuthStore();

  if (!hydrated) {
    return null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
