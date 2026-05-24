import { useState } from "react";
import api from "../../../services/api";
import { initialChangePasswordFormData } from "./changePasswordConstants";

function useChangePasswordForm() {
  const [formData, setFormData] = useState(initialChangePasswordFormData);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    resetMessages();
  };

  const validateClientSide = () => {
    if (!formData.currentPassword.trim()) {
      setErrorMessage("Current password is required.");
      return false;
    }

    if (!formData.newPassword.trim()) {
      setErrorMessage("New password is required.");
      return false;
    }

    if (formData.newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters.");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData(initialChangePasswordFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    resetMessages();

    if (!validateClientSide()) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/user/change-password", {
        current_password: formData.currentPassword,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword,
      });

      setSuccessMessage(
        response.data.message || "Password changed successfully."
      );

      resetForm();
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        setErrorMessage("Please fix the validation errors.");
        return;
      }

      if (error.response?.status === 401) {
        setErrorMessage("Current password is incorrect.");
        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    resetMessages();
  };

  return {
    formData,
    successMessage,
    errorMessage,
    errors,
    loading,
    handleChange,
    handleSubmit,
    handleCancel,
  };
}

export default useChangePasswordForm;