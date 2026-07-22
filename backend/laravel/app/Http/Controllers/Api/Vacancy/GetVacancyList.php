<?php

namespace App\Http\Controllers\Api\Vacancy;

use App\Actions\Vacancy\GetVacancyListAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class GetVacancyList extends Controller
{
    public function __invoke(
        Request $request,
        GetVacancyListAction $getVacancyListAction
    ): JsonResponse {
        try {
            $perPage = max(1, min((int) $request->integer('per_page', 20), 100));
            $vacancies = $getVacancyListAction->execute($perPage);

            return response()->json([
                'status' => true,
                'message' => 'Vacancies fetched successfully.',
                'data' => [
                    'vacancies' => $vacancies->items(),
                    'pagination' => [
                        'current_page' => $vacancies->currentPage(),
                        'last_page' => $vacancies->lastPage(),
                        'per_page' => $vacancies->perPage(),
                        'total' => $vacancies->total(),
                    ],
                ],
                'errors' => null,
            ]);
        } catch (Throwable $e) {
            Log::error('Failed to fetch vacancies.', [
                'exception' => $e,
                'user_id' => $request->user()?->id,
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Failed to load vacancies. Please try again.',
                'data' => null,
                'errors' => [
                    'server' => ['The vacancy list could not be loaded.'],
                ],
            ], 500);
        }
    }
}
