<?php

namespace App\Http\Controllers\Api\Vacancy;

use App\Http\Controllers\Controller;
use App\Models\Vacancy;
use App\Services\Vacancy\VacancyResumePdfService;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DownloadVacancyResumePdf extends Controller
{
    public function __invoke(
        Vacancy $vacancy,
        VacancyResumePdfService $pdfService
    ): BinaryFileResponse {
        $filename = trim((string) $vacancy->resume_pdf_file_name) !== ''
            ? $vacancy->resume_pdf_file_name
            : 'vacancy-' . $vacancy->id . '-resume.pdf';

        return response()->download(
            $pdfService->absolutePath($vacancy),
            $filename,
            [
                'Content-Type' => 'application/pdf',
                'Cache-Control' => 'private, no-store, max-age=0',
            ]
        );
    }
}
