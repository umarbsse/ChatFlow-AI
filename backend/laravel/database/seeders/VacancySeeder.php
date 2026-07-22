<?php

namespace Database\Seeders;

use App\Models\Vacancy;
use Illuminate\Database\Seeder;

class VacancySeeder extends Seeder
{
    public function run(): void
    {
        Vacancy::query()->updateOrCreate(
            [
                'company_name' => 'Example Company',
                'position_name' => 'Software Engineer',
            ],
            [
                'job_description' => 'Example vacancy record. Replace or remove this seeded record as needed.',
                'job_url' => null,
                'location' => null,
                'employment_type' => 'full-time',
                'resume_old_latex_code' => 'Example original resume LaTeX.',
                'ai_prompt' => 'Tailor this resume for [job_description] using [resume_old_latex_code].',
                'compiled_ai_prompt' => 'Tailor this resume for Example vacancy record. Replace or remove this seeded record as needed. using Example original resume LaTeX.',
                'resume_updated_latex_code' => null,
                'open_ai_raw_response' => null,
                'resume_pdf_file_path' => null,
                'resume_pdf_file_name' => null,
                'ai_instance_id' => null,
                'apply_date' => null,
                'status' => 'draft',
                'notes' => 'Created by VacancySeeder.',
            ]
        );
    }
}
