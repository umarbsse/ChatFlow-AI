<?php
namespace App\Http\Controllers\Api\Vacancy;
use App\Actions\Vacancy\UpdateVacancyAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Vacancy\UpdateVacancyRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Throwable;
class UpdateVacancy extends Controller { public function __invoke(int $vacancy, UpdateVacancyRequest $request, UpdateVacancyAction $action): JsonResponse { try { $item=$action->execute($vacancy,$request->validated()); return response()->json(['status'=>true,'message'=>'Vacancy updated successfully.','data'=>['vacancy'=>$item],'errors'=>null]); } catch (ModelNotFoundException) { return response()->json(['status'=>false,'message'=>'Vacancy not found.','data'=>null,'errors'=>null],404); } catch (Throwable $e) { Log::error('Failed to update vacancy.',['exception'=>$e,'vacancy_id'=>$vacancy]); return response()->json(['status'=>false,'message'=>'Failed to update vacancy.','data'=>null,'errors'=>['server'=>['The vacancy could not be updated.']]],500); } } }
