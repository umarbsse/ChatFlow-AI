import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
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

    if (formData.password !== formData.password_confirmation) {
      setMessage("Passwords do not match.");
      return;
    }

    console.log("Register Data:", formData);
    setMessage("Registration successful.");
  };

  return (
    <section className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row shadow-lg rounded-4 overflow-hidden bg-white">
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-primary p-5">
            <div className="text-center text-white">
              <div className="mb-4">
                <i className="fa-solid fa-comments display-1 text-white"></i>
              </div>

              <h2 className="fw-bold">Create Your Account</h2>

              <p className="mb-4">
                Join the chat app and start messaging in real time.
              </p>

              <button type="button" className="btn btn-light btn-lg fw-semibold px-4">
                <i className="fa-solid fa-message me-2"></i>
                Start Chatting
              </button>
            </div>
          </div>

          <div className="col-lg-6 p-4 p-md-5">
            <div className="mb-4">
              <h3 className="fw-bold text-dark">Register</h3>
              <p className="text-muted mb-0">
                Enter your details to create your account.
              </p>
            </div>

            {message && (
              <div
                className={`alert ${
                  message.includes("successful")
                    ? "alert-success"
                    : "alert-danger"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa-solid fa-user"></i>
                  </span>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa-solid fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa-solid fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Confirm Password
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa-solid fa-shield-halved"></i>
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

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                <i className="fa-solid fa-user-plus me-2"></i>
                Create Account
              </button>

              <p className="text-center text-muted mt-4 mb-0">
                Already have an account?{" "}
                <a href="/login" className="text-decoration-none fw-semibold">
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;