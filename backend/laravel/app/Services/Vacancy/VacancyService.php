<?php

namespace App\Services\Vacancy;

use App\Models\Vacancy;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class VacancyService
{
    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        return Vacancy::query()
            ->latest('id')
            ->paginate($perPage);
    }

    /**
     * Create a vacancy while preserving blank text inputs as empty strings.
     * Typed nullable database fields use null when the form is blank.
     */
    public function create(array $data): Vacancy
    {
        return Vacancy::create([
            'company_name' => $this->text($data, 'company_name'),
            'position_name' => $this->text($data, 'position_name'),
            'job_description' => $this->text($data, 'job_description'),
            'job_url' => $this->text($data, 'job_url'),
            'location' => $this->text($data, 'location'),
            'employment_type' => $this->text($data, 'employment_type'),
            'resume_old_latex_code' => $this->text($data, 'resume_old_latex_code'),
            'ai_prompt' => $this->text($data, 'ai_prompt'),
            'resume_updated_latex_code' => $this->text($data, 'resume_updated_latex_code'),
            'resume_pdf_file_path' => $this->text($data, 'resume_pdf_file_path'),
            'resume_pdf_file_name' => $this->text($data, 'resume_pdf_file_name'),
            'ai_instance_id' => $this->nullableInteger($data, 'ai_instance_id'),
            'apply_date' => $this->nullableText($data, 'apply_date'),
            'status' => $this->text($data, 'status', 'draft'),
            'notes' => $this->text($data, 'notes'),
        ]);
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
