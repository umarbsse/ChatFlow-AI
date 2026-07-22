import { useEffect, useState } from "react";
import api from "../../../services/api";
import { initialVacancyFormData } from "./vacancyFormConstants";

function normalizeConfigResponse(responseData) {
  return responseData?.data?.config || responseData?.config || {};
}

function buildVacancyFormData(config = {}) {
  return {
    ...initialVacancyFormData,
    resume_old_latex_code: config.VACANCY_ORIGINAL_RESUME_LATEX || "",
    ai_prompt: config.VACANCY_AI_PROMPT || "",
  };
}

function useVacancyForm() {
  const [formData, setFormData] = useState(initialVacancyFormData);
  const [defaultFormData, setDefaultFormData] = useState(initialVacancyFormData);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setErrors({});
  };

  useEffect(() => {
    const loadVacancyConfig = async () => {
      try {
        setLoadingConfig(true);
        setErrorMessage("");

        const response = await api.get("/config/openai");
        const config = normalizeConfigResponse(response.data);
        const nextFormData = buildVacancyFormData(config);

        setFormData(nextFormData);
        setDefaultFormData(nextFormData);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Failed to load the default vacancy configuration."
        );
      } finally {
        setLoadingConfig(false);
      }
    };

    loadVacancyConfig();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    clearMessages();
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    clearMessages();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearMessages();

    try {
      setSaving(true);
      const response = await api.post("/vacancies", formData);
      setSuccessMessage(response.data?.message || "Vacancy created successfully.");
      setFormData(defaultFormData);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data?.errors || {});
        setErrorMessage("Please correct the highlighted fields.");
      } else {
        setErrorMessage(error.response?.data?.message || "Failed to create vacancy.");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    loadingConfig,
    saving,
    successMessage,
    errorMessage,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
  };
}

export default useVacancyForm;
