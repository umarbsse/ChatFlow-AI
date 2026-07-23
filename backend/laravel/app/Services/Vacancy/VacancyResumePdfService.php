<?php

namespace App\Services\Vacancy;

use App\Models\Config;
use App\Models\Vacancy;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;
use Symfony\Component\Process\Process;
use Throwable;

class VacancyResumePdfService
{
    public function compileAndStore(Vacancy $vacancy, string $latexCode): Vacancy
    {
        $latexCode = trim($latexCode);

        if ($latexCode === '') {
            throw new RuntimeException('Cannot compile an empty LaTeX document.');
        }

        $temporaryDirectory = storage_path(
            'app/vacancy-resumes/tmp/' . $vacancy->id . '-' . Str::uuid()
        );

        File::ensureDirectoryExists($temporaryDirectory);

        $texPath = $temporaryDirectory . DIRECTORY_SEPARATOR . 'resume.tex';
        File::put($texPath, $latexCode);

        try {
            $this->runPdfLatex($temporaryDirectory);
            $this->runPdfLatex($temporaryDirectory);

            $compiledPdf = $temporaryDirectory . DIRECTORY_SEPARATOR . 'resume.pdf';

            if (!File::isFile($compiledPdf)) {
                throw new RuntimeException('LaTeX finished without creating resume.pdf.');
            }

            $directory = 'vacancy-resumes/' . $vacancy->id;
            $filename = sprintf('vacancy-%d-resume.pdf', $vacancy->id);
            $relativePath = $directory . '/' . $filename;

            Storage::disk('local')->makeDirectory($directory);

            if ($vacancy->resume_pdf_file_path !== '' && $vacancy->resume_pdf_file_path !== null) {
                Storage::disk('local')->delete($vacancy->resume_pdf_file_path);
            }

            Storage::disk('local')->put($relativePath, File::get($compiledPdf));

            $vacancy->update([
                'resume_pdf_file_path' => $relativePath,
                'resume_pdf_file_name' => $filename,
            ]);

            return $vacancy->refresh();
        } finally {
            File::deleteDirectory($temporaryDirectory);
        }
    }

    public function absolutePath(Vacancy $vacancy): string
    {
        $relativePath = trim((string) $vacancy->resume_pdf_file_path);

        if ($relativePath === '' || !Storage::disk('local')->exists($relativePath)) {
            throw new RuntimeException('The generated resume PDF does not exist.');
        }

        return Storage::disk('local')->path($relativePath);
    }

    public function deleteForVacancy(Vacancy $vacancy): void
    {
        $relativePath = trim((string) $vacancy->resume_pdf_file_path);

        if ($relativePath !== '') {
            Storage::disk('local')->delete($relativePath);
        }

        Storage::disk('local')->deleteDirectory('vacancy-resumes/' . $vacancy->id);
    }

    private function runPdfLatex(string $workingDirectory): void
    {
        $binary = trim((string) Config::value('LATEX_BINARY', 'pdflatex'));

        if ($binary === '') {
            $binary = 'pdflatex';
        }

        $process = new Process([
            $binary,
            '-interaction=nonstopmode',
            '-halt-on-error',
            '-file-line-error',
            'resume.tex',
        ], $workingDirectory);

        $timeout = (int) Config::value('LATEX_COMPILE_TIMEOUT', 120);
        $process->setTimeout((float) max(10, $timeout));
        $process->run();

        if (!$process->isSuccessful()) {
            Log::error('Vacancy LaTeX compilation failed.', [
                'command' => $process->getCommandLine(),
                'exit_code' => $process->getExitCode(),
                'output' => $process->getOutput(),
                'error_output' => $process->getErrorOutput(),
            ]);

            $message = trim($process->getErrorOutput() . PHP_EOL . $process->getOutput());

            throw new RuntimeException(
                'Unable to compile the vacancy resume PDF. ' . Str::limit($message, 1000)
            );
        }
    }
}
