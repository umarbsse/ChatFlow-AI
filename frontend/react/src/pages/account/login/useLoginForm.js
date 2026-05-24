import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { initialLoginFormData } from "./loginConstants";

function useLoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialLoginFormData);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isSuccessMessage = message.toLowerCase().includes("successful");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const storeAuthData = ({ token, tokenType, user }) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("token_type", tokenType);

    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setErrors({});

    try {
      setLoading(true);

      const response = await api.post("/user/login", {
        email: formData.email,
        password: formData.password,
        remember: formData.remember,
      });

      const token = response.data.data?.token;
      const tokenType = response.data.data?.token_type || "Bearer";
      const user = response.data.data?.user;

      if (!token) {
        setMessage("Login successful, but token was not returned from API.");
        return;
      }

      storeAuthData({ token, tokenType, user });

      setMessage(response.data.message || "Login successful.");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        setMessage("Please fix the validation errors.");
        return;
      }

      if (error.response?.status === 401) {
        setMessage("Invalid email or password.");
        return;
      }

      setMessage(error.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    message,
    errors,
    loading,
    isSuccessMessage,
    handleChange,
    handleSubmit,
  };
}

export default useLoginForm;