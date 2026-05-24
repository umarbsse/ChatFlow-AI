import { useState } from "react";
import { initialForgotPasswordFormData } from "./forgotPasswordConstants";

function useForgotPasswordForm() {
  const [formData, setFormData] = useState(initialForgotPasswordFormData);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    try {
      setLoading(true);

      console.log("Forgot Password Data:", formData);

      setMessage("Password reset link has been sent to your email.");
      setFormData(initialForgotPasswordFormData);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    message,
    loading,
    handleChange,
    handleSubmit,
  };
}

export default useForgotPasswordForm;