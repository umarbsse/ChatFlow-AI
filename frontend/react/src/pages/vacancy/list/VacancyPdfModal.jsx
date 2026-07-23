import { useEffect } from "react";

function VacancyPdfModal({ open, url, title, onClose }) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("vacancy-pdf-modal-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("vacancy-pdf-modal-open");
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="vacancy-pdf-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="vacancy-pdf-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title || "Resume PDF viewer"}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="vacancy-pdf-modal-header">
          <div>
            <span className="vacancy-list-eyebrow">Resume PDF</span>
            <h5 className="mb-0 fw-bold">{title || "Generated resume"}</h5>
          </div>
          <button type="button" className="vacancy-pdf-modal-close" onClick={onClose} aria-label="Close PDF viewer">
            &times;
          </button>
        </div>

        <div className="vacancy-pdf-modal-body">
          {url ? (
            <iframe src={url} title={title || "Resume PDF"} className="vacancy-pdf-frame" />
          ) : (
            <div className="vacancy-list-state">PDF is not available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VacancyPdfModal;
