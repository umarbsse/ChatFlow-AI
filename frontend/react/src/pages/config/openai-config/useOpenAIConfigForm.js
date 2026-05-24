import { useEffect, useState } from "react";
import api from "../../../services/api";
import {
  initialOpenAIConfigFormData,
  normalizeOpenAIConfigResponse,
} from "./openAIConfigConstants";

function useOpenAIConfigForm() {
  const [formData, setFormData] = useState(initialOpenAIConfigFormData);
  const [originalData, setOriginalData] = useState(initialOpenAIConfigFormData);

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
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await api.get("/config/openai");
        const config = normalizeOpenAIConfigResponse(response.data);

        const nextData = {
          ...initialOpenAIConfigFormData,
          ...config,
        };

        setFormData(nextData);
        setOriginalData(nextData);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to load OpenAI configuration."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
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

      const response = await api.put("/config/openai", formData);
      const config = normalizeOpenAIConfigResponse(response.data);

      const updatedData = {
        ...initialOpenAIConfigFormData,
        ...config,
      };

      setFormData(updatedData);
      setOriginalData(updatedData);

      setSuccessMessage(
        response.data.message || "OpenAI configuration updated successfully."
      );
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        setErrorMessage("Please fix the validation errors.");
        return;
      }

      setErrorMessage(
        error.response?.data?.message || "Failed to update OpenAI configuration."
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

export default useOpenAIConfigForm;