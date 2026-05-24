<?php

namespace App\Actions\Config;

use App\Services\Config\OpenAIEnvConfigService;

class GetOpenAIConfigAction
{
    public function __construct(
        private OpenAIEnvConfigService $openAIEnvConfigService
    ) {
        //
    }

    public function execute(): array
    {
        return $this->openAIEnvConfigService->getConfig();
    }
}