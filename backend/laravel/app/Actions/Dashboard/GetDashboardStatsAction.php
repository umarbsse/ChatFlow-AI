<?php

namespace App\Actions\Dashboard;

use App\Models\User;
use App\Services\Dashboard\DashboardStatsService;

class GetDashboardStatsAction
{
    public function __construct(
        private DashboardStatsService $dashboardStatsService
    ) {
        //
    }

    public function execute(User $user): array
    {
        return $this->dashboardStatsService->getStats($user->id);
    }
}