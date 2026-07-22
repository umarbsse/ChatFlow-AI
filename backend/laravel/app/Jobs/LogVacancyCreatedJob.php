<?php

namespace App\Jobs;

use App\Models\Vacancy;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class LogVacancyCreatedJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public int $vacancyId
    ) {
        //
    }

    public function handle(): void
    {
        $vacancy = Vacancy::find($this->vacancyId);

        if (!$vacancy) {
            Log::warning('Vacancy-created log skipped because vacancy was not found.', [
                'vacancy_id' => $this->vacancyId,
            ]);

            return;
        }

        Log::info('Vacancy created.', [
            'vacancy_id' => $vacancy->id,
            'company_name' => $vacancy->company_name,
            'position_name' => $vacancy->position_name,
            'status' => $vacancy->status,
            'created_at' => $vacancy->created_at?->toDateTimeString(),
        ]);
    }
}
