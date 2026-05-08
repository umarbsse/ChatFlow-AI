import { useEffect, useState } from "react";
import LeftNavbar from "../../components/LeftNavbar";
import Header from "../../components/Header";
import api from "../../services/api";

function AccountSettings() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [originalData, setOriginalData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await api.get("/user/profile");

        const user = response.data.data?.user || response.data.data || response.data.user;

        if (!user) {
          setErrorMessage("Unable to load user profile.");
          return;
        }

        const userData = {
          name: user.name || "",
          email: user.email || "",
        };

        setFormData(userData);
        setOriginalData(userData);
      } catch (error) {
        setErrorMessage("Failed to load account settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

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

    try {
      setSaving(true);

      const response = await api.put("/user/profile", {
        name: formData.name,
        email: formData.email,
      });

      const user = response.data.data?.user || response.data.data || response.data.user;

      const updatedUserData = {
        name: user?.name || formData.name,
        email: user?.email || formData.email,
      };

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
      } else {
        setErrorMessage("Failed to update account settings.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
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
                  <h4 className="fw-bold mb-1">Account Settings</h4>
                  <p className="text-muted mb-0">
                    Update your name and email address.
                  </p>
                </div>

                <span className="account-settings-icon">
                  <i className="fa-solid fa-user-gear"></i>
                </span>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    Loading account settings...
                  </p>
                </div>
              ) : (
                <>
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
                      <label className="form-label fw-semibold">Name</label>

                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fa-solid fa-user"></i>
                        </span>

                        <input
                          type="text"
                          name="name"
                          className={`form-control ${
                            errors.name ? "is-invalid" : ""
                          }`}
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>

                      {errors.name && (
                        <div className="text-danger small mt-1">
                          {errors.name[0]}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Email Address
                      </label>

                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fa-solid fa-envelope"></i>
                        </span>

                        <input
                          type="email"
                          name="email"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      {errors.email && (
                        <div className="text-danger small mt-1">
                          {errors.email[0]}
                        </div>
                      )}
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-light rounded-pill"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-floppy-disk me-2"></i>
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AccountSettings;