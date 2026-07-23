<?php
namespace App\Http\Controllers\Api\Vacancy;
use App\Actions\Vacancy\GetVacancyAction;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
class GetVacancy extends Controller { public function __invoke(int $vacancy, GetVacancyAction $action): JsonResponse { try { return response()->json(['status'=>true,'message'=>'Vacancy fetched successfully.','data'=>['vacancy'=>$action->execute($vacancy)],'errors'=>null]); } catch (ModelNotFoundException) { return response()->json(['status'=>false,'message'=>'Vacancy not found.','data'=>null,'errors'=>null],404); } } }
