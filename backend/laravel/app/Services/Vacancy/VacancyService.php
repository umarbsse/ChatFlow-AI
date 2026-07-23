<?php

namespace App\Services\Vacancy;

use App\Models\Vacancy;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class VacancyService
{
    public function __construct(
        private readonly VacancyPromptCompiler $promptCompiler
    ) {
    }

    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        return Vacancy::query()->latest('id')->paginate($perPage);
    }

    public function findOrFail(int $vacancyId): Vacancy
    {
        return Vacancy::query()->findOrFail($vacancyId);
    }

    public function create(array $data): Vacancy
    {
        $jobDescription = $this->text($data, 'job_description');
        $originalResumeLatex = $this->text($data, 'resume_old_latex_code');
        $aiPrompt = $this->text($data, 'ai_prompt');

        return Vacancy::create([
            'company_name' => $this->text($data, 'company_name'),
            'position_name' => $this->text($data, 'position_name'),
            'job_description' => $jobDescription,
            'job_url' => $this->text($data, 'job_url'),
            'location' => $this->text($data, 'location'),
            'employment_type' => $this->text($data, 'employment_type'),
            'resume_old_latex_code' => $originalResumeLatex,
            'ai_prompt' => $aiPrompt,
            'compiled_ai_prompt' => $this->promptCompiler->compile($aiPrompt, $jobDescription, $originalResumeLatex),
            'resume_updated_latex_code' => $this->text($data, 'resume_updated_latex_code'),
            'open_ai_raw_response' => $this->text($data, 'open_ai_raw_response'),
            'resume_pdf_file_path' => $this->text($data, 'resume_pdf_file_path'),
            'resume_pdf_file_name' => $this->text($data, 'resume_pdf_file_name'),
            'ai_instance_id' => $this->nullableInteger($data, 'ai_instance_id'),
            'apply_date' => $this->nullableText($data, 'apply_date'),
            'status' => $this->text($data, 'status', 'draft'),
            'notes' => $this->text($data, 'notes'),
        ]);
    }

    public function update(Vacancy $vacancy, array $data): Vacancy
    {
        $vacancy->fill([
            'company_name' => $this->text($data, 'company_name'),
            'position_name' => $this->text($data, 'position_name'),
            'job_description' => $this->text($data, 'job_description'),
            'job_url' => $this->text($data, 'job_url'),
            'location' => $this->text($data, 'location'),
            'employment_type' => $this->text($data, 'employment_type'),
            'resume_old_latex_code' => $this->text($data, 'resume_old_latex_code'),
            'ai_prompt' => $this->text($data, 'ai_prompt'),
            'compiled_ai_prompt' => $this->text($data, 'compiled_ai_prompt'),
            'resume_updated_latex_code' => $this->text($data, 'resume_updated_latex_code'),
            'open_ai_raw_response' => $this->text($data, 'open_ai_raw_response'),
            'resume_pdf_file_path' => $this->text($data, 'resume_pdf_file_path'),
            'resume_pdf_file_name' => $this->text($data, 'resume_pdf_file_name'),
            'ai_instance_id' => $this->nullableInteger($data, 'ai_instance_id'),
            'apply_date' => $this->nullableText($data, 'apply_date'),
            'status' => $this->text($data, 'status', 'draft'),
            'notes' => $this->text($data, 'notes'),
        ]);
        $vacancy->save();

        return $vacancy->refresh();
    }

    public function delete(Vacancy $vacancy): void
    {
        $vacancy->delete();
    }

    private function text(array $data, string $key, string $default = ''): string
    {
        $value = $data[$key] ?? $default;
        return $value === null ? '' : trim((string) $value);
    }

    private function nullableText(array $data, string $key): ?string
    {
        $value = trim((string) ($data[$key] ?? ''));
        return $value === '' ? null : $value;
    }

    private function nullableInteger(array $data, string $key): ?int
    {
        $value = $data[$key] ?? null;
        return $value === null || $value === '' ? null : (int) $value;
    }
}
