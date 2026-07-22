<?php

namespace App\Services\Vacancy;

class VacancyPromptCompiler
{
    /**
     * Replace supported vacancy placeholders with the submitted form values.
     */
    public function compile(
        string $template,
        string $jobDescription,
        string $originalResumeLatex
    ): string {
        return str_replace(
            ['[job_description]', '[resume_old_latex_code]'],
            [$jobDescription, $originalResumeLatex],
            $template
        );
    }
}
