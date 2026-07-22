import { useState } from "react";
import api from "../../../services/api";
import { initialVacancyFormData } from "./vacancyFormConstants";

function useVacancyForm() {
  const [formData, setFormData] = useState(initialVacancyFormData);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    clearMessages();
  };

  const resetForm = () => {
    setFormData(initialVacancyFormData);
    clearMessages();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearMessages();

    try {
      setSaving(true);
      const response = await api.post("/vacancies", formData);
      setSuccessMessage(response.data?.message || "Vacancy created successfully.");
      setFormData(initialVacancyFormData);
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

  return { formData, saving, successMessage, errorMessage, errors, handleChange, handleSubmit, resetForm };
}

export default useVacancyForm;
