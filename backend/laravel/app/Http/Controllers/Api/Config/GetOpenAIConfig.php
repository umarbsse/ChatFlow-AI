<?php

namespace App\Http\Controllers\Api\Config;

use App\Actions\Config\GetOpenAIConfigAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Throwable;

class GetOpenAIConfig extends Controller
{
    public function __invoke(GetOpenAIConfigAction $getOpenAIConfigAction): JsonResponse
    {
        try {
            return response()->json([
                'status' => true,
                'message' => 'OpenAI configuration fetched successfully.',
                'data' => [
                    'config' => $getOpenAIConfigAction->execute(),
                ],
                'errors' => null,
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong. Please try again.',
                'data' => null,
                'errors' => [
                    'server' => [$e->getMessage()],
                ],
            ], 500);
        }
    }
}