function OpenAIConfigInput({
  field,
  value,
  error,
  onChange,
}) {
  const commonProps = {
    name: field.name,
    className: `form-control ${error ? "is-invalid" : ""}`,
    value,
    onChange,
  };

  const isTextarea = field.type === "textarea" || field.name === "CHATGPT_ROLE_CONTENT";

  return (
    <div className={isTextarea ? "mb-4" : "mb-3"}>
      <label className="form-label fw-semibold">{field.label}</label>

      <div className="input-group">
        <span className="input-group-text">
          <i className={field.icon}></i>
        </span>

        {field.type === "select" ? (
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        ) : isTextarea ? (
          <textarea
            {...commonProps}
            rows={field.rows || 4}
            placeholder={field.placeholder || "Enter configuration value"}
          ></textarea>
        ) : (
          <input
            {...commonProps}
            type={field.type}
            step={field.step}
            placeholder={field.placeholder}
          />
        )}
      </div>

      {error && <div className="text-danger small mt-1">{error[0]}</div>}
    </div>
  );
}

export default OpenAIConfigInput;