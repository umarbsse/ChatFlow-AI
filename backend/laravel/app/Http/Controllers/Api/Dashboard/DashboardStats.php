<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Actions\Dashboard\GetDashboardStatsAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class DashboardStats extends Controller
{
    public function __invoke(
        Request $request,
        GetDashboardStatsAction $getDashboardStatsAction
    ): JsonResponse {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthenticated.',
                    'data' => null,
                    'errors' => [
                        'auth' => ['User is not authenticated.'],
                    ],
                ], 401);
            }

            $dashboardData = $getDashboardStatsAction->execute($user);

            return response()->json([
                'status' => true,
                'message' => 'Dashboard data fetched successfully.',
                'data' => $dashboardData,
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