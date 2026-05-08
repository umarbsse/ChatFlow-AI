import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("auth_token");

  if (!token || token === "undefined" || token === "null") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("token_type");

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;