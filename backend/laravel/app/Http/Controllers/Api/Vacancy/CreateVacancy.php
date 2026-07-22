<?php

namespace App\Http\Controllers\Api\Vacancy;

use App\Actions\Vacancy\CreateVacancyAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Vacancy\CreateVacancyRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Throwable;

class CreateVacancy extends Controller
{
    public function __invoke(
        CreateVacancyRequest $request,
        CreateVacancyAction $createVacancyAction
    ): JsonResponse {
        try {
            $vacancy = $createVacancyAction->execute($request->validated(), $request->user());

            return response()->json([
                'status' => true,
                'message' => 'Vacancy created successfully.',
                'data' => [
                    'vacancy' => $vacancy,
                ],
                'errors' => null,
            ], 201);
        } catch (Throwable $e) {
            Log::error('Failed to create vacancy.', [
                'exception' => $e,
                'user_id' => $request->user()?->id,
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Failed to create vacancy. Please try again.',
                'data' => null,
                'errors' => [
                    'server' => ['The vacancy could not be saved.'],
                ],
            ], 500);
        }
    }
}
