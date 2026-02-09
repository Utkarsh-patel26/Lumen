import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { token, role } = useAuthStore();

  useEffect(() => {
    if (token && role) {
      navigate(role === "admin" ? "/dashboard/admin" : "/dashboard/student", { replace: true });
    }
  }, [token, role, navigate]);
};

export default useAuthRedirect;
