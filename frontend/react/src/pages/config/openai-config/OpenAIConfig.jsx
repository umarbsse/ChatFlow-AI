import OpenAIConfigInput from "./OpenAIConfigInput";
import {
  openAIConfigFields,
  vacancyConfigFields,
} from "./openAIConfigConstants";
import useOpenAIConfigForm from "./useOpenAIConfigForm";

function OpenAIConfig() {
  const {
    formData,
    loading,
    saving,
    successMessage,
    errorMessage,
    errors,
    handleChange,
    handleSubmit,
    handleCancel,
  } = useOpenAIConfigForm();

  return (
    <section className="account-settings-page">
      <div className="account-settings-container">
        <div className="account-settings-card">
          <OpenAIConfigHeader />

          {loading ? (
            <OpenAIConfigLoading />
          ) : (
            <>
              {successMessage && (
                <div className="alert alert-success rounded-3" role="alert">
                  <i className="fa-solid fa-circle-check me-2"></i>
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="alert alert-danger rounded-3" role="alert">
                  <i className="fa-solid fa-circle-exclamation me-2"></i>
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <ConfigSection
                  title="OpenAI Configuration"
                  description="Models, credentials, chat behavior, tools, and request settings."
                  icon="fa-solid fa-robot"
                >
                  <div className="row">
                    {openAIConfigFields.map((field) => (
                      <div
                        className={
                          field.name === "OPENAI_API_KEY" ||
                          field.name === "CHATGPT_ROLE_CONTENT"
                            ? "col-12"
                            : "col-md-6"
                        }
                        key={field.name}
                      >
                        <OpenAIConfigInput
                          field={field}
                          value={formData[field.name] ?? ""}
                          error={errors[field.name]}
                          onChange={handleChange}
                        />
                      </div>
                    ))}
                  </div>
                </ConfigSection>

                <ConfigSection
                  title="Vacancy Configuration"
                  description="Prompt used for AI-assisted vacancy and resume processing."
                  icon="fa-solid fa-briefcase"
                >
                  {vacancyConfigFields.map((field) => (
                    <OpenAIConfigInput
                      key={field.name}
                      field={field}
                      value={formData[field.name] ?? ""}
                      error={errors[field.name]}
                      onChange={handleChange}
                    />
                  ))}
                </ConfigSection>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk me-2"></i>
                        Save Config
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ConfigSection({ title, description, icon, children }) {
  return (
    <div className="border rounded-4 p-3 p-md-4 mb-4">
      <div className="d-flex align-items-start gap-3 mb-3">
        <span className="account-settings-icon flex-shrink-0">
          <i className={icon}></i>
        </span>
        <div>
          <h5 className="fw-bold mb-1">{title}</h5>
          <p className="text-muted mb-0">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function OpenAIConfigHeader() {
  return (
    <div className="account-settings-header">
      <div>
        <h4 className="fw-bold mb-1">OpenAI Configuration</h4>
        <p className="text-muted mb-0">
          Manage OpenAI models, API key, chat behavior, and request settings.
        </p>
      </div>

      <span className="account-settings-icon">
        <i className="fa-solid fa-gear"></i>
      </span>
    </div>
  );
}

function OpenAIConfigLoading() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>

      <p className="text-muted mt-3 mb-0">Loading OpenAI configuration...</p>
    </div>
  );
}

export default OpenAIConfig;