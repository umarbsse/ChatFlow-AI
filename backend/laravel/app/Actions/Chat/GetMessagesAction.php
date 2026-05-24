<?php

namespace App\Actions\Chat;

use App\Models\User;
use App\Services\Chat\ChatMessageService;
use Illuminate\Support\Collection;

class GetMessagesAction
{
    public function __construct(
        private ChatMessageService $chatMessageService
    ) {
        //
    }

    public function execute(User $user, int $aiInstanceId): array
    {
        $messages = $this->chatMessageService->getMessagesByInstance(
            $user->id,
            $aiInstanceId
        );

        return [
            'ai_instance_id' => $aiInstanceId,
            'instance_title' => $messages->first()->instance_title ?? null,
            'messages' => $messages,
        ];
    }
}