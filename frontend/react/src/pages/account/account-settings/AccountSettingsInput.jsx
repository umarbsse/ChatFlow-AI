function AccountSettingsInput({
  label,
  name,
  type = "text",
  icon,
  placeholder,
  value,
  error,
  onChange,
}) {
  return (
    <div className={name === "email" ? "mb-4" : "mb-3"}>
      <label className="form-label fw-semibold">{label}</label>

      <div className="input-group">
        <span className="input-group-text">
          <i className={icon}></i>
        </span>

        <input
          type={type}
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

export default AccountSettingsInput;