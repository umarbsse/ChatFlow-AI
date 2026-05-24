import { Link } from "react-router-dom";
import RegisterInput from "./RegisterInput";
import useRegisterForm from "./useRegisterForm";
import { registerFeatureItems } from "./registerConstants";

function Register() {
  const {
    formData,
    message,
    errors,
    loading,
    isSuccessMessage,
    handleChange,
    handleSubmit,
  } = useRegisterForm();

  return (
    <section className="min-vh-100 bg-light">
      <div className="container py-5">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-xl-10">
            <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
              <div className="row g-0">
                <RegisterSidePanel />

                <div className="col-lg-7 bg-white p-4 p-md-5">
                  <RegisterHeader />

                  {message && (
                    <div
                      className={`alert d-flex align-items-center ${
                        isSuccessMessage ? "alert-success" : "alert-danger"
                      }`}
                      role="alert"
                    >
                      <i
                        className={`fa-solid me-2 ${
                          isSuccessMessage
                            ? "fa-circle-check"
                            : "fa-triangle-exclamation"
                        }`}
                      ></i>
                      <div>{message}</div>
                    </div>
                  )}

                  <form className="needs-validation" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <RegisterInput
                          label="Full Name"
                          name="name"
                          icon="fa-solid fa-user"
                          placeholder="John Doe"
                          value={formData.name}
                          error={errors.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <RegisterInput
                          label="Username"
                          name="username"
                          icon="fa-solid fa-at"
                          placeholder="johndoe"
                          value={formData.username}
                          error={errors.username}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <RegisterInput
                        label="Email Address"
                        name="email"
                        type="email"
                        icon="fa-solid fa-envelope"
                        placeholder="john@example.com"
                        value={formData.email}
                        error={errors.email}
                        onChange={handleChange}
                        required
                        helpText="We will never share your email with anyone else."
                      />
                    </div>

                    <div className="mb-3">
                      <RegisterInput
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        icon="fa-solid fa-phone"
                        placeholder="+92 300 1234567"
                        value={formData.phone}
                        error={errors.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <RegisterInput
                          label="Password"
                          name="password"
                          type="password"
                          icon="fa-solid fa-lock"
                          placeholder="Password"
                          value={formData.password}
                          error={errors.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <RegisterInput
                          label="Confirm Password"
                          name="password_confirmation"
                          type="password"
                          icon="fa-solid fa-shield-halved"
                          placeholder="Confirm password"
                          value={formData.password_confirmation}
                          error={errors.password_confirmation}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <TermsCheckbox
                      checked={formData.terms}
                      error={errors.terms}
                      onChange={handleChange}
                    />

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 fw-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-user-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </button>

                    <SocialLoginButtons />

                    <p className="text-center text-muted mt-4 mb-0">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-decoration-none fw-semibold"
                      >
                        Login here
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>

            <p className="text-center text-muted small mt-4 mb-0">
              © 2026 ChatApp. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RegisterSidePanel() {
  return (
    <div className="col-lg-5 bg-primary text-white p-5 d-none d-lg-flex align-items-center">
      <div>
        <div className="mb-4">
          <span className="d-inline-flex align-items-center justify-content-center bg-white bg-opacity-25 rounded-circle p-4">
            <i className="fa-solid fa-comments display-5"></i>
          </span>
        </div>

        <h1 className="fw-bold mb-3">Welcome to ChatApp</h1>

        <p className="lead mb-4">
          Create your account and start secure real-time messaging with your
          friends and teams.
        </p>

        {registerFeatureItems.map((item) => (
          <div className="d-flex align-items-center mb-3" key={item.title}>
            <span
              className="bg-white bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center me-3"
              style={{ width: "42px", height: "42px" }}
            >
              <i className={item.icon}></i>
            </span>

            <div>
              <h6 className="mb-0 fw-bold">{item.title}</h6>
              <small className="text-white-50">{item.description}</small>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-light fw-semibold px-4 py-2 mt-5">
          <i className="fa-solid fa-circle-play me-2"></i>
          Explore Features
        </button>
      </div>
    </div>
  );
}

function RegisterHeader() {
  return (
    <div className="mb-4">
      <span className="badge text-bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">
        <i className="fa-solid fa-user-plus me-2"></i>
        New Account
      </span>

      <h2 className="fw-bold mb-2">Create your account</h2>

      <p className="text-muted mb-0">
        Fill in the details below to register your ChatApp account.
      </p>
    </div>
  );
}

function TermsCheckbox({ checked, error, onChange }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <div className="form-check">
          <input
            className={`form-check-input ${error ? "is-invalid" : ""}`}
            type="checkbox"
            name="terms"
            id="terms"
            checked={checked}
            onChange={onChange}
          />

          <label className="form-check-label" htmlFor="terms">
            I agree to the{" "}
            <Link to="/terms" className="text-decoration-none">
              Terms
            </Link>
          </label>
        </div>

        {error && <div className="text-danger small mt-1">{error[0]}</div>}
      </div>
    </div>
  );
}

function SocialLoginButtons() {
  return (
    <>
      <div className="position-relative text-center my-4">
        <hr />
        <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
          or
        </span>
      </div>

      <div className="row g-2">
        <div className="col-md-6">
          <button type="button" className="btn btn-outline-dark w-100">
            <i className="fa-brands fa-google me-2"></i>
            Google
          </button>
        </div>

        <div className="col-md-6">
          <button type="button" className="btn btn-outline-primary w-100">
            <i className="fa-brands fa-facebook-f me-2"></i>
            Facebook
          </button>
        </div>
      </div>
    </>
  );
}

export default Register;