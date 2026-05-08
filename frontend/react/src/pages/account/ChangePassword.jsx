import { useState } from "react";
import LeftNavbar from "../../components/LeftNavbar";
import Header from "../../components/Header";
import api from "../../services/api";

function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");
    setErrors({});

    if (!formData.currentPassword.trim()) {
      setErrorMessage("Current password is required.");
      return;
    }

    if (!formData.newPassword.trim()) {
      setErrorMessage("New password is required.");
      return;
    }

    if (formData.newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
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

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        setErrorMessage("Please fix the validation errors.");
      } else if (error.response?.status === 401) {
        setErrorMessage("Current password is incorrect.");
      } else {
        setErrorMessage("Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setSuccessMessage("");
    setErrorMessage("");
    setErrors({});
  };

  return (
    <div className="chat-app">
      <LeftNavbar />

      <main className="chat-content">
        <Header />

        <section className="account-settings-page">
          <div className="account-settings-container">
            <div className="account-settings-card">
              <div className="account-settings-header">
                <div>
                  <h4 className="fw-bold mb-1">Change Password</h4>
                  <p className="text-muted mb-0">
                    Update your account password securely.
                  </p>
                </div>

                <span className="account-settings-icon">
                  <i className="fa-solid fa-lock"></i>
                </span>
              </div>

              {successMessage && (
                <div className="alert alert-success rounded-3" role="alert">
                  <i className="fa-solid fa-circle-check me-2"></i>
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="alert alert-danger rounded-3" role="alert">
                  <i className="fa-solid fa-circle-exclamation me-2"></i>
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Current Password
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa-solid fa-key"></i>
                    </span>

                    <input
                      type="password"
                      name="currentPassword"
                      className={`form-control ${
                        errors.current_password ? "is-invalid" : ""
                      }`}
                      placeholder="Enter current password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </div>

                  {errors.current_password && (
                    <div className="text-danger small mt-1">
                      {errors.current_password[0]}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    New Password
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa-solid fa-lock"></i>
                    </span>

                    <input
                      type="password"
                      name="newPassword"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>

                  {errors.password && (
                    <div className="text-danger small mt-1">
                      {errors.password[0]}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Confirm Password
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa-solid fa-lock"></i>
                    </span>

                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk me-2"></i>
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ChangePassword;