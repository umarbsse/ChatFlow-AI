function ChangePasswordInput({
  label,
  name,
  icon,
  placeholder,
  value,
  error,
  onChange,
}) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>

      <div className="input-group">
        <span className="input-group-text">
          <i className={icon}></i>
        </span>

        <input
          type="password"
          name={name}
          className={`form-control ${error ? "is-invalid" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>

      {error && <div className="text-danger small mt-1">{error[0]}</div>}
    </div>
  );
}

export default ChangePasswordInput;