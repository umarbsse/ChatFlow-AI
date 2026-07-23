const fields = [
  ["company_name", "Company Name", "input"],
  ["position_name", "Position Name", "input"],
  ["job_description", "Job Description", "textarea"],
  ["job_url", "Job URL", "input"],
  ["location", "Location", "input"],
  ["employment_type", "Employment Type", "input"],
  ["resume_old_latex_code", "Original Resume LaTeX", "code"],
  ["ai_prompt", "AI Prompt", "textarea"],
  ["compiled_ai_prompt", "Compiled AI Prompt", "code"],
  ["resume_updated_latex_code", "Updated Resume LaTeX", "code"],
  ["open_ai_raw_response", "OpenAI Raw Response", "code"],
  ["resume_pdf_file_path", "Resume PDF File Path", "input"],
  ["resume_pdf_file_name", "Resume PDF File Name", "input"],
  ["ai_instance_id", "AI Instance ID", "number"],
  ["apply_date", "Apply Date", "date"],
  ["status", "Status", "input"],
  ["notes", "Notes", "textarea"],
];

function VacancyModal({ mode, vacancy, form, setForm, saving, error, onClose, onSave }) {
  if (!mode || !vacancy) return null;
  const editing = mode === "edit";

  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="vacancy-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="vacancy-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <div className="vacancy-modal-header">
          <div>
            <span className="vacancy-list-eyebrow">Vacancy #{vacancy.id}</span>
            <h4 className="mb-0">{editing ? "Update Vacancy" : "Vacancy Details"}</h4>
          </div>
          <button type="button" className="vacancy-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {error && <div className="alert alert-danger mx-4 mt-3 mb-0">{error}</div>}

        <div className="vacancy-modal-body">
          <div className="vacancy-meta-grid">
            <div><span>ID</span><strong>#{vacancy.id}</strong></div>
            <div><span>Created</span><strong>{vacancy.created_at || "—"}</strong></div>
            <div><span>Updated</span><strong>{vacancy.updated_at || "—"}</strong></div>
          </div>

          <div className="vacancy-form-grid">
            {fields.map(([key, label, type]) => {
              const value = editing ? (form[key] ?? "") : (vacancy[key] ?? "");
              const wide = ["job_description", "resume_old_latex_code", "ai_prompt", "compiled_ai_prompt", "resume_updated_latex_code", "open_ai_raw_response", "notes"].includes(key);
              return (
                <div className={`vacancy-modal-field ${wide ? "vacancy-modal-field-wide" : ""}`} key={key}>
                  <label>{label}</label>
                  {editing ? (
                    type === "textarea" || type === "code" ? (
                      <textarea
                        className={`form-control ${type === "code" ? "vacancy-code-input" : ""}`}
                        rows={type === "code" ? 9 : 5}
                        value={value}
                        onChange={(e) => change(key, e.target.value)}
                      />
                    ) : (
                      <input
                        className="form-control"
                        type={type}
                        value={value}
                        onChange={(e) => change(key, e.target.value)}
                      />
                    )
                  ) : (
                    <div className={`vacancy-read-value ${type === "code" ? "vacancy-code-value" : ""}`}>
                      {String(value).trim() || "—"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="vacancy-modal-footer">
          <button type="button" className="btn btn-light" onClick={onClose}>Close</button>
          {editing && (
            <button type="button" className="btn btn-primary" disabled={saving} onClick={onSave}>
              {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : "Update Vacancy"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VacancyModal;
