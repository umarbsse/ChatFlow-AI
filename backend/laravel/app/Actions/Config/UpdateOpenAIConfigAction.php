<?php

namespace App\Actions\Config;

use App\Services\Config\OpenAIEnvConfigService;

class UpdateOpenAIConfigAction
{
    public function __construct(
        private OpenAIEnvConfigService $openAIEnvConfigService
    ) {
        //
    }

    public function execute(array $validated): array
    {
        return $this->openAIEnvConfigService->updateConfig($validated);
    }
}