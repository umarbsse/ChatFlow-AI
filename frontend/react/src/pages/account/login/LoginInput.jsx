function LoginInput({
  label,
  name,
  type = "text",
  icon,
  placeholder,
  value,
  error,
  onChange,
  required = false,
}) {
  return (
    <>
      <label className="form-label fw-semibold">{label}</label>

      <div className="input-group input-group-lg">
        <span className="input-group-text bg-light">
          <i className={`${icon} text-primary`}></i>
        </span>

        <input
          type={type}
          name={name}
          className={`form-control ${error ? "is-invalid" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>

      {error && <div className="text-danger small mt-1">{error[0]}</div>}
    </>
  );
}

export default LoginInput;