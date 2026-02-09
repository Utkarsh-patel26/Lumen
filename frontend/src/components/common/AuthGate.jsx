import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore.js";

const AuthGate = ({ children }) => {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return children;
};

export default AuthGate;
