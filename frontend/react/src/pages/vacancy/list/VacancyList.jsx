import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./vacancyList.css";

function VacancyList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vacancies, setVacancies] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );

  const loadVacancies = async (page = 1) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/vacancies", {
        params: { page, per_page: 20 },
      });

      setVacancies(response.data?.data?.vacancies || []);
      setPagination(
        response.data?.data?.pagination || {
          current_page: 1,
          last_page: 1,
          total: 0,
        }
      );
    } catch (error) {
      setVacancies([]);
      setErrorMessage(
        error.response?.data?.message || "Failed to load vacancies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVacancies();

    if (location.state?.successMessage) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const displayText = (value) => {
    const text = String(value ?? "").trim();
    return text || "—";
  };

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
  };

  return (
    <section className="vacancy-list-page">
      <div className="vacancy-list-container">
        <div className="vacancy-list-header">
          <div>
            <span className="vacancy-list-eyebrow">Recruitment workspace</span>
            <h3 className="fw-bold mb-2">Vacancies</h3>
            <p className="text-muted mb-0">
              Review all vacancies saved in the database.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary rounded-pill px-4"
            onClick={() => navigate("/Vacancy/add")}
          >
            <i className="fa-solid fa-plus me-2"></i>
            Add Vacancy
          </button>
        </div>

        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="fa-solid fa-circle-check me-2"></i>
            {successMessage}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setSuccessMessage("")}
            ></button>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{errorMessage}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => loadVacancies(pagination.current_page || 1)}
            >
              Retry
            </button>
          </div>
        )}

        <div className="vacancy-list-card">
          <div className="vacancy-list-card-top">
            <div>
              <h5 className="fw-bold mb-1">Vacancy List</h5>
              <p className="text-muted mb-0">
                {pagination.total || 0} record{pagination.total === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="vacancy-list-state">
              <span className="spinner-border text-primary mb-3"></span>
              <span>Loading vacancies...</span>
            </div>
          ) : vacancies.length === 0 ? (
            <div className="vacancy-list-state">
              <i className="fa-regular fa-folder-open"></i>
              <h5 className="fw-bold mt-3 mb-2">No vacancies found</h5>
              <p className="text-muted mb-3">
                Create the first vacancy to see it here.
              </p>
              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={() => navigate("/Vacancy/add")}
              >
                Add Vacancy
              </button>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table vacancy-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Company</th>
                      <th>Position</th>
                      <th>Job Description</th>
                      <th>Status</th>
                      <th>Apply Date</th>
                      <th>AI Instance</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vacancies.map((vacancy) => (
                      <tr key={vacancy.id}>
                        <td className="fw-semibold">#{vacancy.id}</td>
                        <td>{displayText(vacancy.company_name)}</td>
                        <td>{displayText(vacancy.position_name)}</td>
                        <td>
                          <div className="vacancy-description-cell">
                            {displayText(vacancy.job_description)}
                          </div>
                        </td>
                        <td>
                          <span className="vacancy-status-badge">
                            {displayText(vacancy.status)}
                          </span>
                        </td>
                        <td>{formatDate(vacancy.apply_date)}</td>
                        <td>{displayText(vacancy.ai_instance_id)}</td>
                        <td>{formatDate(vacancy.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.last_page > 1 && (
                <div className="vacancy-pagination">
                  <button
                    type="button"
                    className="btn btn-light"
                    disabled={pagination.current_page <= 1 || loading}
                    onClick={() => loadVacancies(pagination.current_page - 1)}
                  >
                    Previous
                  </button>

                  <span>
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>

                  <button
                    type="button"
                    className="btn btn-light"
                    disabled={pagination.current_page >= pagination.last_page || loading}
                    onClick={() => loadVacancies(pagination.current_page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default VacancyList;
