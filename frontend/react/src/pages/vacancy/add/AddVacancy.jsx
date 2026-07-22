import VacancyField from "./VacancyField";
import useVacancyForm from "./useVacancyForm";
import { vacancyFormSections } from "./vacancyFormConstants";
import "./addVacancy.css";

function AddVacancy() {
  const { formData, loadingConfig, saving, successMessage, errorMessage, errors, handleChange, handleSubmit, resetForm } = useVacancyForm();

  return (
    <section className="vacancy-page">
      <div className="vacancy-container">
        <div className="vacancy-page-header">
          <div>
            <span className="vacancy-eyebrow">Recruitment workspace</span>
            <h3 className="fw-bold mb-2">Add New Vacancy</h3>
            <p className="text-muted mb-0">Add the job description, original resume LaTeX, and AI instructions.</p>
          </div>
          <span className="vacancy-header-icon"><i className="fa-solid fa-briefcase"></i></span>
        </div>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        {loadingConfig && (
          <div className="alert alert-info d-flex align-items-center">
            <span className="spinner-border spinner-border-sm me-2"></span>
            Loading vacancy configuration...
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {vacancyFormSections.map((section) => (
            <div className="vacancy-card" key={section.title}>
              <div className="vacancy-section-header">
                <span className="vacancy-section-icon"><i className={section.icon}></i></span>
                <div>
                  <h5 className="fw-bold mb-1">{section.title}</h5>
                  <p className="text-muted mb-0">{section.description}</p>
                </div>
              </div>
              <div className="row g-4">
                {section.fields.map((field) => (
                  <VacancyField key={field.name} field={field} value={formData[field.name] ?? ""} error={errors[field.name]} onChange={handleChange} />
                ))}
              </div>
            </div>
          ))}

          <div className="vacancy-actions">
            <button type="button" className="btn btn-light rounded-pill px-4" onClick={resetForm} disabled={saving || loadingConfig}>Clear Form</button>
            <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={saving || loadingConfig}>
              {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <><i className="fa-solid fa-floppy-disk me-2"></i>Save Vacancy</>}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AddVacancy;
