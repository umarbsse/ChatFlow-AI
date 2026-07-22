<?php

namespace App\Actions\Vacancy;

use App\Events\VacancyCreated;
use App\Models\User;
use App\Models\Vacancy;
use App\Services\Vacancy\VacancyService;
use Illuminate\Support\Facades\DB;

class CreateVacancyAction
{
    public function __construct(
        private VacancyService $vacancyService
    ) {
        //
    }

    public function execute(array $validated, User $user): Vacancy
    {
        $vacancy = DB::transaction(
            fn (): Vacancy => $this->vacancyService->create($validated)
        );

        VacancyCreated::dispatch($vacancy, $user->id);

        return $vacancy;
    }
}
