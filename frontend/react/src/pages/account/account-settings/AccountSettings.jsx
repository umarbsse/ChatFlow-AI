import AccountSettingsInput from "./AccountSettingsInput";
import useAccountSettingsForm from "./useAccountSettingsForm";

function AccountSettings() {
  const {
    formData,
    loading,
    saving,
    successMessage,
    errorMessage,
    errors,
    handleChange,
    handleSubmit,
    handleCancel,
  } = useAccountSettingsForm();

  return (
    <section className="account-settings-page">
      <div className="account-settings-container">
        <div className="account-settings-card">
          <AccountSettingsHeader />

          {loading ? (
            <AccountSettingsLoading />
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
                <AccountSettingsInput
                  label="Name"
                  name="name"
                  icon="fa-solid fa-user"
                  placeholder="Enter your name"
                  value={formData.name}
                  error={errors.name}
                  onChange={handleChange}
                />

                <AccountSettingsInput
                  label="Email Address"
                  name="email"
                  type="email"
                  icon="fa-solid fa-envelope"
                  placeholder="Enter your email"
                  value={formData.email}
                  error={errors.email}
                  onChange={handleChange}
                />

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
  );
}

function AccountSettingsHeader() {
  return (
    <div className="account-settings-header">
      <div>
        <h4 className="fw-bold mb-1">Account Settings</h4>
        <p className="text-muted mb-0">Update your name and email address.</p>
      </div>

      <span className="account-settings-icon">
        <i className="fa-solid fa-user-gear"></i>
      </span>
    </div>
  );
}

function AccountSettingsLoading() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>

      <p className="text-muted mt-3 mb-0">Loading account settings...</p>
    </div>
  );
}

export default AccountSettings;