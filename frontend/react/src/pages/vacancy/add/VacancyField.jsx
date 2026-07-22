function VacancyField({ field, value, error, onChange }) {
  const inputClassName = `form-control ${field.monospace ? "vacancy-code-input" : ""} ${error ? "is-invalid" : ""}`;

  const commonProps = {
    id: field.name,
    name: field.name,
    value,
    onChange,
    className: inputClassName,
  };

  let control;

  if (field.type === "textarea") {
    control = <textarea {...commonProps} rows={field.rows || 5} />;
  } else if (field.type === "select") {
    control = (
      <select {...commonProps}>
        {field.options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  } else {
    control = <input {...commonProps} type={field.type} min={field.min} />;
  }

  return (
    <div className={field.fullWidth ? "col-12" : "col-12 col-lg-6"}>
      <label htmlFor={field.name} className="form-label fw-semibold">{field.label}</label>
      <div className="input-group vacancy-input-group">
        <span className="input-group-text"><i className={field.icon}></i></span>
        {control}
      </div>
      {error && <div className="text-danger small mt-1">{error[0]}</div>}
    </div>
  );
}

export default VacancyField;
