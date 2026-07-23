<?php
namespace App\Actions\Vacancy;
use App\Models\Vacancy;
use App\Services\Vacancy\VacancyService;
use Illuminate\Support\Facades\DB;
class UpdateVacancyAction { public function __construct(private VacancyService $service) {} public function execute(int $id, array $data): Vacancy { return DB::transaction(function () use ($id, $data) { return $this->service->update($this->service->findOrFail($id), $data); }); } }
