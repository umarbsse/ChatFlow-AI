<?php

namespace App\Http\Requests\Api\Vacancy;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['nullable', 'string', 'max:191'],
            'position_name' => ['nullable', 'string', 'max:191'],
            'job_description' => ['nullable', 'string'],
            'job_url' => ['nullable', 'string', 'max:2048'],
            'location' => ['nullable', 'string', 'max:191'],
            'employment_type' => ['nullable', 'string', 'max:100'],
            'resume_old_latex_code' => ['nullable', 'string'],
            'ai_prompt' => ['nullable', 'string'],
            'resume_updated_latex_code' => ['nullable', 'string'],
            'resume_pdf_file_path' => ['nullable', 'string', 'max:2048'],
            'resume_pdf_file_name' => ['nullable', 'string', 'max:255'],
            'ai_instance_id' => ['nullable', 'integer', 'min:0'],
            'apply_date' => ['nullable', 'date_format:Y-m-d'],
            'status' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'ai_instance_id' => $this->blankToNull($this->input('ai_instance_id')),
            'apply_date' => $this->blankToNull($this->input('apply_date')),
        ]);
    }

    private function blankToNull(mixed $value): mixed
    {
        return $value === '' ? null : $value;
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'status' => false,
                'message' => 'Validation failed.',
                'data' => null,
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
