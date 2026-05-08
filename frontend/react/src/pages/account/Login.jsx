import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setErrors({});

    try {
      setLoading(true);

      const response = await api.post("/user/login", {
        email: formData.email,
        password: formData.password,
        remember: formData.remember,
      });

      const token = response.data.token || response.data.access_token;
      const user = response.data.user;

      if (token) {
        localStorage.setItem("auth_token", token);
      }

      if (user) {
        localStorage.setItem("auth_user", JSON.stringify(user));
      }

      setMessage(response.data.message || "Login successful.");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        setMessage("Please fix the validation errors.");
      } else if (error.response?.status === 401) {
        setMessage("Invalid email or password.");
      } else {
        setMessage("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-vh-100 bg-light">
      <div className="container py-5">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-xl-10">
            <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
              <div className="row g-0">
                <div className="col-lg-5 bg-primary text-white p-5 d-none d-lg-flex align-items-center">
                  <div>
                    <div className="mb-4">
                      <span className="d-inline-flex align-items-center justify-content-center bg-white bg-opacity-25 rounded-circle p-4">
                        <i className="fa-solid fa-right-to-bracket display-5"></i>
                      </span>
                    </div>

                    <h1 className="fw-bold mb-3">Welcome Back</h1>

                    <p className="lead mb-4">
                      Login to continue chatting with your friends and teams in
                      real time.
                    </p>

                    <div className="d-flex align-items-center mb-3">
                      <span
                        className="bg-white bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                        style={{ width: "42px", height: "42px" }}
                      >
                        <i className="fa-solid fa-shield-halved"></i>
                      </span>
                      <div>
                        <h6 className="mb-0 fw-bold">Secure Login</h6>
                        <small className="text-white-50">
                          Protected account access
                        </small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <span
                        className="bg-white bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                        style={{ width: "42px", height: "42px" }}
                      >
                        <i className="fa-solid fa-bolt"></i>
                      </span>
                      <div>
                        <h6 className="mb-0 fw-bold">Fast Messaging</h6>
                        <small className="text-white-50">
                          Real-time chat experience
                        </small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <span
                        className="bg-white bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                        style={{ width: "42px", height: "42px" }}
                      >
                        <i className="fa-solid fa-user-group"></i>
                      </span>
                      <div>
                        <h6 className="mb-0 fw-bold">Stay Connected</h6>
                        <small className="text-white-50">
                          Chat privately or in groups
                        </small>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-light fw-semibold px-4 py-2 mt-5"
                    >
                      <i className="fa-solid fa-comments me-2"></i>
                      Open Chat
                    </button>
                  </div>
                </div>

                <div className="col-lg-7 bg-white p-4 p-md-5">
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

                  {message && (
                    <div
                      className={`alert d-flex align-items-center ${
                        message.includes("successful")
                          ? "alert-success"
                          : "alert-danger"
                      }`}
                      role="alert"
                    >
                      <i
                        className={`fa-solid me-2 ${
                          message.includes("successful")
                            ? "fa-circle-check"
                            : "fa-triangle-exclamation"
                        }`}
                      ></i>
                      <div>{message}</div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Email Address
                      </label>

                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light">
                          <i className="fa-solid fa-envelope text-primary"></i>
                        </span>

                        <input
                          type="email"
                          name="email"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {errors.email && (
                        <div className="text-danger small mt-1">
                          {errors.email[0]}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Password
                      </label>

                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light">
                          <i className="fa-solid fa-lock text-primary"></i>
                        </span>

                        <input
                          type="password"
                          name="password"
                          className={`form-control ${
                            errors.password ? "is-invalid" : ""
                          }`}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {errors.password && (
                        <div className="text-danger small mt-1">
                          {errors.password[0]}
                        </div>
                      )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="remember"
                          id="remember"
                          checked={formData.remember}
                          onChange={handleChange}
                        />

                        <label className="form-check-label" htmlFor="remember">
                          Remember me
                        </label>
                      </div>

                      <a href="/forgot-password" className="text-decoration-none">
                        Forgot password?
                      </a>
                    </div>

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

                    <div className="position-relative text-center my-4">
                      <hr />
                      <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                        or
                      </span>
                    </div>

                    <div className="row g-2">
                      <div className="col-md-6">
                        <button
                          type="button"
                          className="btn btn-outline-dark w-100"
                        >
                          <i className="fa-brands fa-google me-2"></i>
                          Google
                        </button>
                      </div>

                      <div className="col-md-6">
                        <button
                          type="button"
                          className="btn btn-outline-primary w-100"
                        >
                          <i className="fa-brands fa-facebook-f me-2"></i>
                          Facebook
                        </button>
                      </div>
                    </div>

                    <p className="text-center text-muted mt-4 mb-0">
                      Don&apos;t have an account?{" "}
                      <a
                        href="/register"
                        className="text-decoration-none fw-semibold"
                      >
                        Register here
                      </a>
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

export default Login;