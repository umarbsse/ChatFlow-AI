import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    terms: false,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!formData.terms) {
      setMessage("Please accept the terms and conditions.");
      return;
    }

    console.log("Register Data:", formData);
    setMessage("Registration successful.");
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
                        <i className="fa-solid fa-comments display-5"></i>
                      </span>
                    </div>

                    <h1 className="fw-bold mb-3">Welcome to ChatApp</h1>

                    <p className="lead mb-4">
                      Create your account and start secure real-time messaging
                      with your friends and teams.
                    </p>

                    <div className="d-flex align-items-center mb-3">
                      <span className="bg-white bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: "42px", height: "42px" }}>
                        <i className="fa-solid fa-bolt"></i>
                      </span>
                      <div>
                        <h6 className="mb-0 fw-bold">Real-time Messaging</h6>
                        <small className="text-white-50">
                          Fast and smooth conversations
                        </small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <span className="bg-white bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: "42px", height: "42px" }}>
                        <i className="fa-solid fa-lock"></i>
                      </span>
                      <div>
                        <h6 className="mb-0 fw-bold">Private Chats</h6>
                        <small className="text-white-50">
                          Secure personal conversations
                        </small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <span className="bg-white bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: "42px", height: "42px" }}>
                        <i className="fa-solid fa-users"></i>
                      </span>
                      <div>
                        <h6 className="mb-0 fw-bold">Group Support</h6>
                        <small className="text-white-50">
                          Chat with multiple users
                        </small>
                      </div>
                    </div>

                    <button type="button" className="btn btn-light fw-semibold px-4 py-2 mt-5">
                      <i className="fa-solid fa-circle-play me-2"></i>
                      Explore Features
                    </button>
                  </div>
                </div>

                <div className="col-lg-7 bg-white p-4 p-md-5">
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

                  <form className="needs-validation" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Full Name
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text bg-light">
                            <i className="fa-solid fa-user text-primary"></i>
                          </span>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Username
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text bg-light">
                            <i className="fa-solid fa-at text-primary"></i>
                          </span>
                          <input
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder="johndoe"
                            value={formData.username}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

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
                          className="form-control"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-text">
                        We will never share your email with anyone else.
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Phone Number
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light">
                          <i className="fa-solid fa-phone text-primary"></i>
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          placeholder="+92 300 1234567"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
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
                            className="form-control"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Confirm Password
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text bg-light">
                            <i className="fa-solid fa-shield-halved text-primary"></i>
                          </span>
                          <input
                            type="password"
                            name="password_confirmation"
                            className="form-control"
                            placeholder="Confirm password"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="terms"
                          id="terms"
                          checked={formData.terms}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="terms">
                          I agree to the{" "}
                          <a href="/terms" className="text-decoration-none">
                            Terms
                          </a>
                        </label>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-100 fw-semibold">
                      <i className="fa-solid fa-user-plus me-2"></i>
                      Create Account
                    </button>

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

                    <p className="text-center text-muted mt-4 mb-0">
                      Already have an account?{" "}
                      <a href="/login" className="text-decoration-none fw-semibold">
                        Login here
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

export default Register;