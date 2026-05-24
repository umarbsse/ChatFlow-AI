function ForgotPasswordInput({
  label,
  name,
  type = "text",
  icon,
  placeholder,
  value,
  onChange,
  required = false,
  helpText = "",
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
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>

      {helpText && <div className="form-text">{helpText}</div>}
    </>
  );
}

export default ForgotPasswordInput;