<?php
namespace App\Actions\Vacancy;
use App\Models\Vacancy;
use App\Services\Vacancy\VacancyService;
class GetVacancyAction { public function __construct(private VacancyService $service) {} public function execute(int $id): Vacancy { return $this->service->findOrFail($id); } }
