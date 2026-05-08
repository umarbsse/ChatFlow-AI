import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Logout() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Logging out...");

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // If your Laravel API has logout endpoint, this will revoke/delete token.
        await api.post("/user/logout");
      } catch (error) {
        console.log("Logout API error:", error);
      } finally {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("token_type");

        setMessage("You have been logged out successfully.");

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 800);
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <section className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
      <div className="card border-0 shadow-lg rounded-5 p-5 text-center">
        <div className="mb-4">
          <span className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle p-4">
            <i className="fa-solid fa-right-from-bracket display-6"></i>
          </span>
        </div>

        <h3 className="fw-bold mb-2">Logout</h3>
        <p className="text-muted mb-0">{message}</p>

        <div className="spinner-border text-primary mt-4" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </section>
  );
}

export default Logout;