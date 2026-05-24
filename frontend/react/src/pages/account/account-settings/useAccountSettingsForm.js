import { useEffect, useState } from "react";
import api from "../../../services/api";
import {
  initialAccountSettingsFormData,
  normalizeUserResponse,
} from "./accountSettingsConstants";

function useAccountSettingsForm() {
  const [formData, setFormData] = useState(initialAccountSettingsFormData);
  const [originalData, setOriginalData] = useState(
    initialAccountSettingsFormData
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setErrors({});
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await api.get("/user/profile");
        const userData = normalizeUserResponse(response.data);

        if (!userData.name && !userData.email) {
          setErrorMessage("Unable to load user profile.");
          return;
        }

        setFormData(userData);
        setOriginalData(userData);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to load account settings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    resetMessages();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    resetMessages();

    try {
      setSaving(true);

      const response = await api.put("/user/profile", {
        name: formData.name,
        email: formData.email,
      });

      const updatedUserData = normalizeUserResponse(response.data, formData);

      setFormData(updatedUserData);
      setOriginalData(updatedUserData);

      localStorage.setItem("auth_user", JSON.stringify(updatedUserData));

      setSuccessMessage(
        response.data.message || "Account settings updated successfully."
      );
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        setErrorMessage("Please fix the validation errors.");
        return;
      }

      setErrorMessage(
        error.response?.data?.message || "Failed to update account settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    resetMessages();
  };

  return {
    formData,
    loading,
    saving,
    successMessage,
    errorMessage,
    errors,
    handleChange,
    handleSubmit,
    handleCancel,
  };
}

export default useAccountSettingsForm;