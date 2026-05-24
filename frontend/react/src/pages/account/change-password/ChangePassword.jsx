import ChangePasswordInput from "./ChangePasswordInput";
import useChangePasswordForm from "./useChangePasswordForm";

function ChangePassword() {
  const {
    formData,
    successMessage,
    errorMessage,
    errors,
    loading,
    handleChange,
    handleSubmit,
    handleCancel,
  } = useChangePasswordForm();

  return (
    <section className="account-settings-page">
      <div className="account-settings-container">
        <div className="account-settings-card">
          <ChangePasswordHeader />

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
            <ChangePasswordInput
              label="Current Password"
              name="currentPassword"
              icon="fa-solid fa-key"
              placeholder="Enter current password"
              value={formData.currentPassword}
              error={errors.current_password}
              onChange={handleChange}
            />

            <ChangePasswordInput
              label="New Password"
              name="newPassword"
              icon="fa-solid fa-lock"
              placeholder="Enter new password"
              value={formData.newPassword}
              error={errors.password}
              onChange={handleChange}
            />

            <div className="mb-4">
              <ChangePasswordInput
                label="Confirm Password"
                name="confirmPassword"
                icon="fa-solid fa-lock"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                error={errors.password_confirmation}
                onChange={handleChange}
              />
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
  );
}

function ChangePasswordHeader() {
  return (
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
  );
}

export default ChangePassword;