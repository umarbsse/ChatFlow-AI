import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import VacancyModal from "./VacancyModal";
import VacancyPdfModal from "./VacancyPdfModal";
import "./vacancyList.css";

const normalizeVacancy = (vacancy = {}) => ({
  company_name: vacancy.company_name ?? "", position_name: vacancy.position_name ?? "",
  job_description: vacancy.job_description ?? "", job_url: vacancy.job_url ?? "",
  location: vacancy.location ?? "", employment_type: vacancy.employment_type ?? "",
  resume_old_latex_code: vacancy.resume_old_latex_code ?? "", ai_prompt: vacancy.ai_prompt ?? "",
  compiled_ai_prompt: vacancy.compiled_ai_prompt ?? "", resume_updated_latex_code: vacancy.resume_updated_latex_code ?? "",
  open_ai_raw_response: vacancy.open_ai_raw_response ?? "", resume_pdf_file_path: vacancy.resume_pdf_file_path ?? "",
  resume_pdf_file_name: vacancy.resume_pdf_file_name ?? "", ai_instance_id: vacancy.ai_instance_id ?? "",
  apply_date: vacancy.apply_date ? String(vacancy.apply_date).slice(0, 10) : "", status: vacancy.status ?? "",
  notes: vacancy.notes ?? "",
});

function VacancyList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vacancies, setVacancies] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || "");
  const [modalMode, setModalMode] = useState(null);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [pdfAction, setPdfAction] = useState({ id: null, type: null });
  const [pdfViewer, setPdfViewer] = useState({ open: false, url: "", title: "" });

  const loadVacancies = async (page = 1) => {
    try {
      setLoading(true); setErrorMessage("");
      const response = await api.get("/vacancies", { params: { page, per_page: 20 } });
      setVacancies(response.data?.data?.vacancies || []);
      setPagination(response.data?.data?.pagination || { current_page: 1, last_page: 1, total: 0 });
    } catch (error) {
      setVacancies([]); setErrorMessage(error.response?.data?.message || "Failed to load vacancies.");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    loadVacancies();
    if (location.state?.successMessage) navigate(location.pathname, { replace: true, state: {} });
  }, []);

  const fetchVacancy = async (id, mode) => {
    try {
      setModalLoading(true); setModalError("");
      const response = await api.get(`/vacancies/${id}`);
      const item = response.data?.data?.vacancy;
      setSelectedVacancy(item); setEditForm(normalizeVacancy(item)); setModalMode(mode);
    } catch (error) { setErrorMessage(error.response?.data?.message || "Failed to load vacancy details."); }
    finally { setModalLoading(false); }
  };

  const closeModal = () => { if (!saving) { setModalMode(null); setSelectedVacancy(null); setModalError(""); } };

  const updateVacancy = async () => {
    try {
      setSaving(true); setModalError("");
      const response = await api.put(`/vacancies/${selectedVacancy.id}`, editForm);
      const updated = response.data?.data?.vacancy;
      setVacancies((items) => items.map((item) => item.id === updated.id ? updated : item));
      setSuccessMessage(response.data?.message || "Vacancy updated successfully.");
      setModalMode(null); setSelectedVacancy(null); setModalError("");
    } catch (error) {
      const errors = error.response?.data?.errors;
      const first = errors ? Object.values(errors).flat()[0] : null;
      setModalError(first || error.response?.data?.message || "Failed to update vacancy.");
    } finally { setSaving(false); }
  };

  const deleteVacancy = async (vacancy) => {
    if (!window.confirm(`Delete vacancy #${vacancy.id}? This action cannot be undone.`)) return;
    try {
      setDeletingId(vacancy.id); setErrorMessage("");
      const response = await api.delete(`/vacancies/${vacancy.id}`);
      setSuccessMessage(response.data?.message || "Vacancy deleted successfully.");
      await loadVacancies(vacancies.length === 1 && pagination.current_page > 1 ? pagination.current_page - 1 : pagination.current_page);
    } catch (error) { setErrorMessage(error.response?.data?.message || "Failed to delete vacancy."); }
    finally { setDeletingId(null); }
  };


  const closePdfViewer = () => {
    setPdfViewer((current) => {
      if (current.url) URL.revokeObjectURL(current.url);
      return { open: false, url: "", title: "" };
    });
  };

  const openPdfBlob = async (vacancy, type) => {
    try {
      setPdfAction({ id: vacancy.id, type });
      setErrorMessage("");

      const response = await api.get(
        `/vacancies/${vacancy.id}/resume-pdf/${type}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      if (type === "view") {
        setPdfViewer((current) => {
          if (current.url) URL.revokeObjectURL(current.url);
          return {
            open: true,
            url,
            title: vacancy.resume_pdf_file_name || `vacancy-${vacancy.id}-resume.pdf`,
          };
        });
      } else {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = vacancy.resume_pdf_file_name || `vacancy-${vacancy.id}-resume.pdf`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "The resume PDF is not available or could not be opened."
      );
    } finally {
      setPdfAction({ id: null, type: null });
    }
  };

  const displayText = (value) => String(value ?? "").trim() || "—";
  const formatDate = (value) => { if (!value) return "—"; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(); };

  return (
    <section className="vacancy-list-page">
      <div className="vacancy-list-container">
        <div className="vacancy-list-header">
          <div><span className="vacancy-list-eyebrow">Recruitment workspace</span><h3 className="fw-bold mb-2">Vacancies</h3><p className="text-muted mb-0">Review and manage all vacancies saved in the database.</p></div>
          <button type="button" className="btn btn-primary rounded-pill px-4" onClick={() => navigate("/Vacancy/add")}><i className="fa-solid fa-plus me-2" />Add Vacancy</button>
        </div>

        {successMessage && <div className="alert alert-success alert-dismissible fade show" role="alert"><i className="fa-solid fa-circle-check me-2" />{successMessage}<button type="button" className="btn-close" onClick={() => setSuccessMessage("")} /></div>}
        {errorMessage && <div className="alert alert-danger d-flex justify-content-between align-items-center"><span>{errorMessage}</span><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => loadVacancies(pagination.current_page || 1)}>Retry</button></div>}

        <div className="vacancy-list-card">
          <div className="vacancy-list-card-top"><div><h5 className="fw-bold mb-1">Vacancy List</h5><p className="text-muted mb-0">{pagination.total || 0} record{pagination.total === 1 ? "" : "s"}</p></div></div>
          {loading ? <div className="vacancy-list-state"><span className="spinner-border text-primary mb-3" /><span>Loading vacancies...</span></div> : vacancies.length === 0 ? <div className="vacancy-list-state"><i className="fa-regular fa-folder-open" /><h5 className="fw-bold mt-3 mb-2">No vacancies found</h5><button type="button" className="btn btn-primary rounded-pill px-4" onClick={() => navigate("/Vacancy/add")}>Add Vacancy</button></div> : <>
            <div className="table-responsive"><table className="table vacancy-table align-middle mb-0"><thead><tr><th>ID</th><th>Company</th><th>Position</th><th>Created</th><th>Resume PDF</th><th>Actions</th></tr></thead><tbody>
              {vacancies.map((vacancy) => <tr key={vacancy.id}><td className="fw-semibold">#{vacancy.id}</td><td>{displayText(vacancy.company_name)}</td><td>{displayText(vacancy.position_name)}</td><td>{formatDate(vacancy.created_at)}</td><td><div className="vacancy-pdf-actions">
                {vacancy.resume_pdf_file_path ? (
                  <>
                    <button
                      className="btn btn-sm btn-outline-success"
                      disabled={pdfAction.id === vacancy.id}
                      onClick={() => openPdfBlob(vacancy, "view")}
                      title="View generated PDF"
                    >
                      {pdfAction.id === vacancy.id && pdfAction.type === "view" ? <span className="spinner-border spinner-border-sm" /> : <><i className="fa-regular fa-file-pdf me-1" />View</>}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success"
                      disabled={pdfAction.id === vacancy.id}
                      onClick={() => openPdfBlob(vacancy, "download")}
                      title="Download generated PDF"
                    >
                      {pdfAction.id === vacancy.id && pdfAction.type === "download" ? <span className="spinner-border spinner-border-sm" /> : <><i className="fa-solid fa-download me-1" />Download</>}
                    </button>
                  </>
                ) : <span className="text-muted small">Not available</span>}
              </div></td><td><div className="vacancy-actions">
                <button className="btn btn-sm btn-outline-primary" disabled={modalLoading} onClick={() => fetchVacancy(vacancy.id, "view")} title="View vacancy"><i className="fa-regular fa-eye" /></button>
                <button className="btn btn-sm btn-outline-secondary" disabled={modalLoading} onClick={() => fetchVacancy(vacancy.id, "edit")} title="Update vacancy"><i className="fa-regular fa-pen-to-square" /></button>
                <button className="btn btn-sm btn-outline-danger" disabled={deletingId === vacancy.id} onClick={() => deleteVacancy(vacancy)} title="Delete vacancy">{deletingId === vacancy.id ? <span className="spinner-border spinner-border-sm" /> : <i className="fa-regular fa-trash-can" />}</button>
              </div></td></tr>)}
            </tbody></table></div>
            {pagination.last_page > 1 && <div className="vacancy-pagination"><button className="btn btn-light" disabled={pagination.current_page <= 1 || loading} onClick={() => loadVacancies(pagination.current_page - 1)}>Previous</button><span>Page {pagination.current_page} of {pagination.last_page}</span><button className="btn btn-light" disabled={pagination.current_page >= pagination.last_page || loading} onClick={() => loadVacancies(pagination.current_page + 1)}>Next</button></div>}
          </>}
        </div>
      </div>
      <VacancyModal mode={modalMode} vacancy={selectedVacancy} form={editForm} setForm={setEditForm} saving={saving} error={modalError} onClose={closeModal} onSave={updateVacancy} />
      <VacancyPdfModal open={pdfViewer.open} url={pdfViewer.url} title={pdfViewer.title} onClose={closePdfViewer} />
    </section>
  );
}
export default VacancyList;
