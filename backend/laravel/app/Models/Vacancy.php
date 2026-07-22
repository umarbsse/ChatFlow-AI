<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vacancy extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'position_name',
        'job_description',
        'job_url',
        'location',
        'employment_type',
        'resume_old_latex_code',
        'ai_prompt',
        'compiled_ai_prompt',
        'resume_updated_latex_code',
        'resume_pdf_file_path',
        'resume_pdf_file_name',
        'ai_instance_id',
        'apply_date',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'ai_instance_id' => 'integer',
            'apply_date' => 'date',
        ];
    }
}
