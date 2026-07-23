<?php

namespace App\Http\Controllers\Api\Vacancy;

use App\Http\Controllers\Controller;
use App\Models\Vacancy;
use App\Services\Vacancy\VacancyResumePdfService;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ViewVacancyResumePdf extends Controller
{
    public function __invoke(
        Vacancy $vacancy,
        VacancyResumePdfService $pdfService
    ): BinaryFileResponse {
        return response()->file(
            $pdfService->absolutePath($vacancy),
            [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $this->filename($vacancy) . '"',
                'Cache-Control' => 'private, no-store, max-age=0',
            ]
        );
    }

    private function filename(Vacancy $vacancy): string
    {
        return trim((string) $vacancy->resume_pdf_file_name) !== ''
            ? $vacancy->resume_pdf_file_name
            : 'vacancy-' . $vacancy->id . '-resume.pdf';
    }
}
