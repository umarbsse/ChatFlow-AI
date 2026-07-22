export const initialVacancyFormData = {
  company_name: "",
  position_name: "",
  job_description: "",
  job_url: "",
  location: "",
  employment_type: "",
  resume_old_latex_code: "",
  ai_prompt: "",
  resume_updated_latex_code: "",
  resume_pdf_file_path: "",
  resume_pdf_file_name: "",
  ai_instance_id: "",
  apply_date: "",
  status: "draft",
  notes: "",
};

export const vacancyFormSections = [
  {
    title: "Vacancy Resume Input",
    description: "Provide the job description, original resume LaTeX, and instructions for the AI.",
    icon: "fa-solid fa-wand-magic-sparkles",
    fields: [
      {
        name: "job_description",
        label: "Job Description",
        type: "textarea",
        icon: "fa-solid fa-file-lines",
        rows: 10,
        fullWidth: true,
      },
      {
        name: "resume_old_latex_code",
        label: "Original Resume LaTeX",
        type: "textarea",
        icon: "fa-solid fa-code",
        rows: 14,
        fullWidth: true,
        monospace: true,
      },
      {
        name: "ai_prompt",
        label: "AI Prompt",
        type: "textarea",
        icon: "fa-solid fa-message",
        rows: 8,
        fullWidth: true,
      },
    ],
  },
];
