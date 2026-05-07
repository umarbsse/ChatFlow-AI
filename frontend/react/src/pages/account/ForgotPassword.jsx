import { useState } from "react";

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((previousData) => ({
      ...previousData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Forgot Password Data:", formData);
    setMessage("Password reset link has been sent to your email.");
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
                        <i className="fa-solid fa-key display-5"></i>
                      </span>
                    </div>

                    <h1 className="fw-bold mb-3">Forgot Password?</h1>

                    <p className="lead mb-4">
                      No worries. Enter your email and we will send you a reset
                      link to recover your account.
                    </p>

                    <div className="d-flex align-items-center mb-3">
                      <span
                        className="bg-white bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                        style={{ width: "42px", height: "42px" }}
                      >
                        <i className="fa-solid fa-envelope-open-text"></i>
                      </span>
                      <div>
                        <h6 className="mb-0 fw-bold">Email Verification</h6>
                        <small className="text-white-50">
                          Reset link sent to your inbox
                        </small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <span
                        className="bg-white bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                        style={{ width: "42px", height: "42px" }}
                      >
                        <i className="fa-solid fa-shield-halved"></i>
                      </span>
                      <div>
                        <h6 className="mb-0 fw-bold">Secure Recovery</h6>
                        <small className="text-white-50">
                          Safe password reset process
                        </small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <span
                        className="bg-white bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                        style={{ width: "42px", height: "42px" }}
                      >
                        <i className="fa-solid fa-clock"></i>
                      </span>
                      <div>
                        <h6 className="mb-0 fw-bold">Quick Access</h6>
                        <small className="text-white-50">
                          Get back to chatting quickly
                        </small>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-light fw-semibold px-4 py-2 mt-5"
                    >
                      <i className="fa-solid fa-arrow-left me-2"></i>
                      Back to Login
                    </button>
                  </div>
                </div>

                <div className="col-lg-7 bg-white p-4 p-md-5">
                  <div className="mb-4">
                    <span className="badge text-bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">
                      <i className="fa-solid fa-unlock-keyhole me-2"></i>
                      Account Recovery
                    </span>

                    <h2 className="fw-bold mb-2">Reset your password</h2>
                    <p className="text-muted mb-0">
                      Enter your registered email address and we will send you a
                      password reset link.
                    </p>
                  </div>

                  {message && (
                    <div className="alert alert-success d-flex align-items-center">
                      <i className="fa-solid fa-circle-check me-2"></i>
                      <div>{message}</div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
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
                          className="form-control"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-text">
                        Use the email address connected with your ChatApp
                        account.
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 fw-semibold"
                    >
                      <i className="fa-solid fa-paper-plane me-2"></i>
                      Send Reset Link
                    </button>

                    <div className="position-relative text-center my-4">
                      <hr />
                      <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                        remember password?
                      </span>
                    </div>

                    <a
                      href="/login"
                      className="btn btn-outline-primary w-100 fw-semibold"
                    >
                      <i className="fa-solid fa-right-to-bracket me-2"></i>
                      Back to Login
                    </a>

                    <p className="text-center text-muted mt-4 mb-0">
                      Don&apos;t have an account?{" "}
                      <a href="/register" className="text-decoration-none fw-semibold">
                        Create account
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

export default ForgotPassword;