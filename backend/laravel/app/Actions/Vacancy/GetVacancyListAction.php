<?php

namespace App\Actions\Vacancy;

use App\Services\Vacancy\VacancyService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetVacancyListAction
{
    public function __construct(
        private VacancyService $vacancyService
    ) {
        //
    }

    public function execute(int $perPage = 20): LengthAwarePaginator
    {
        return $this->vacancyService->paginate($perPage);
    }
}
