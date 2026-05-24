import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { AUTH_STORAGE_KEYS, LOGOUT_MESSAGES } from "./logoutConstants";

function useLogout() {
  const navigate = useNavigate();

  const [message, setMessage] = useState(LOGOUT_MESSAGES.loading);

  const clearAuthStorage = () => {
    AUTH_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  useEffect(() => {
    let isMounted = true;

    const handleLogout = async () => {
      try {
        await api.post("/user/logout");
      } catch (error) {
        console.log("Logout API error:", error);
      } finally {
        clearAuthStorage();

        if (isMounted) {
          setMessage(LOGOUT_MESSAGES.success);

          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 800);
        }
      }
    };

    handleLogout();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return {
    message,
  };
}

export default useLogout;