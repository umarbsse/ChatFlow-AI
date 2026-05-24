function LogoutCard({ message }) {
  return (
    <div className="card border-0 shadow-lg rounded-5 p-5 text-center">
      <div className="mb-4">
        <span className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle p-4">
          <i className="fa-solid fa-right-from-bracket display-6"></i>
        </span>
      </div>

      <h3 className="fw-bold mb-2">Logout</h3>
      <p className="text-muted mb-0">{message}</p>

      <div className="spinner-border text-primary mt-4" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default LogoutCard;