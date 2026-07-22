<?php

namespace App\Listeners;

use App\Events\VacancyCreated;
use App\Jobs\LogVacancyCreatedJob;

class LogVacancyCreated
{
    public function handle(VacancyCreated $event): void
    {
        LogVacancyCreatedJob::dispatch($event->vacancy->id);
    }
}
