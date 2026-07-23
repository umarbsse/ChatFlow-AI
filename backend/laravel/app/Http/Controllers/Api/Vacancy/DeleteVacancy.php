<?php
namespace App\Http\Controllers\Api\Vacancy;
use App\Actions\Vacancy\DeleteVacancyAction;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Throwable;
class DeleteVacancy extends Controller { public function __invoke(int $vacancy, DeleteVacancyAction $action): JsonResponse { try { $action->execute($vacancy); return response()->json(['status'=>true,'message'=>'Vacancy deleted successfully.','data'=>null,'errors'=>null]); } catch (ModelNotFoundException) { return response()->json(['status'=>false,'message'=>'Vacancy not found.','data'=>null,'errors'=>null],404); } catch (Throwable $e) { Log::error('Failed to delete vacancy.',['exception'=>$e,'vacancy_id'=>$vacancy]); return response()->json(['status'=>false,'message'=>'Failed to delete vacancy.','data'=>null,'errors'=>['server'=>['The vacancy could not be deleted.']]],500); } } }
