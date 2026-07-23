<?php
namespace App\Actions\Vacancy;
use App\Services\Vacancy\VacancyService;
use Illuminate\Support\Facades\DB;
class DeleteVacancyAction { public function __construct(private VacancyService $service) {} public function execute(int $id): void { DB::transaction(function () use ($id) { $this->service->delete($this->service->findOrFail($id)); }); } }
