<?php

namespace App\Http\Controllers\Api\Config;

use App\Actions\Config\UpdateOpenAIConfigAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Config\UpdateOpenAIConfigRequest;
use Illuminate\Http\JsonResponse;
use Throwable;

class UpdateOpenAIConfig extends Controller
{
    public function __invoke(
        UpdateOpenAIConfigRequest $request,
        UpdateOpenAIConfigAction $updateOpenAIConfigAction
    ): JsonResponse {
        try {
            $result = $updateOpenAIConfigAction->execute($request->validated());

            if (!$result['success']) {
                return response()->json([
                    'status' => false,
                    'message' => $result['message'],
                    'data' => null,
                    'errors' => [
                        'config' => [$result['message']],
                    ],
                ], 500);
            }

            return response()->json([
                'status' => true,
                'message' => $result['message'],
                'data' => [
                    'config' => $result['data'],
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