import { Link, useNavigate } from "react-router-dom";
import LoginInput from "./LoginInput";
import useLoginForm from "./useLoginForm";
import { loginFeatureItems } from "./loginConstants";

function Login() {
  const navigate = useNavigate();

  const {
    formData,
    message,
    errors,
    loading,
    isSuccessMessage,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <section className="min-vh-100 bg-light">
      <div className="container py-5">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-xl-10">
            <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
              <div className="row g-0">
                <LoginSidePanel onOpenChat={() => navigate("/chat")} />

                <div className="col-lg-7 bg-white p-4 p-md-5">
                  <LoginHeader />

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

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <LoginInput
                        label="Email Address"
                        name="email"
                        type="email"
                        icon="fa-solid fa-envelope"
                        placeholder="john@example.com"
                        value={formData.email}
                        error={errors.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <LoginInput
                        label="Password"
                        name="password"
                        type="password"
                        icon="fa-solid fa-lock"
                        placeholder="Enter your password"
                        value={formData.password}
                        error={errors.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <LoginOptions
                      remember={formData.remember}
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
                          Logging in...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-right-to-bracket me-2"></i>
                          Login
                        </>
                      )}
                    </button>

                    <SocialLoginButtons />

                    <p className="text-center text-muted mt-4 mb-0">
                      Don&apos;t have an account?{" "}
                      <Link
                        to="/register"
                        className="text-decoration-none fw-semibold"
                      >
                        Register here
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

function LoginSidePanel({ onOpenChat }) {
  return (
    <div className="col-lg-5 bg-primary text-white p-5 d-none d-lg-flex align-items-center">
      <div>
        <div className="mb-4">
          <span className="d-inline-flex align-items-center justify-content-center bg-white bg-opacity-25 rounded-circle p-4">
            <i className="fa-solid fa-right-to-bracket display-5"></i>
          </span>
        </div>

        <h1 className="fw-bold mb-3">Welcome Back</h1>

        <p className="lead mb-4">
          Login to continue chatting with your friends and teams in real time.
        </p>

        {loginFeatureItems.map((item) => (
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

        <button
          type="button"
          className="btn btn-light fw-semibold px-4 py-2 mt-5"
          onClick={onOpenChat}
        >
          <i className="fa-solid fa-comments me-2"></i>
          Open Chat
        </button>
      </div>
    </div>
  );
}

function LoginHeader() {
  return (
    <div className="mb-4">
      <span className="badge text-bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">
        <i className="fa-solid fa-lock me-2"></i>
        Account Login
      </span>

      <h2 className="fw-bold mb-2">Login to your account</h2>

      <p className="text-muted mb-0">
        Enter your email and password to access ChatApp.
      </p>
    </div>
  );
}

function LoginOptions({ remember, onChange }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          name="remember"
          id="remember"
          checked={remember}
          onChange={onChange}
        />

        <label className="form-check-label" htmlFor="remember">
          Remember me
        </label>
      </div>

      <Link to="/forgot-password" className="text-decoration-none">
        Forgot password?
      </Link>
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

export default Login;