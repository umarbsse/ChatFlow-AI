import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { initialRegisterFormData } from "./registerConstants";

function useRegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialRegisterFormData);
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

  const validateClientSide = () => {
    if (formData.password !== formData.password_confirmation) {
      setMessage("Passwords do not match.");
      return false;
    }

    if (!formData.terms) {
      setMessage("Please accept the terms and conditions.");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData(initialRegisterFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setErrors({});

    if (!validateClientSide()) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/user/register", formData);

      setMessage(response.data.message || "Registration successful.");
      resetForm();

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        setMessage("Please fix the validation errors.");
        return;
      }

      setMessage(
        error.response?.data?.message || "Server error. Please try again."
      );
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

export default useRegisterForm;