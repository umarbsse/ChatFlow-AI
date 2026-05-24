<?php

namespace App\Actions\Chat;

use App\Models\ChatMessage;
use App\Models\User;
use App\Services\Chat\ChatFileDeleteService;
use Illuminate\Support\Facades\DB;

class DeleteChatInstanceAction
{
    public function __construct(
        private ChatFileDeleteService $chatFileDeleteService
    ) {
        //
    }

    public function execute(User $user, int $aiInstanceId): array
    {
        $messages = ChatMessage::where('user_id', $user->id)
            ->where('ai_instance_id', $aiInstanceId)
            ->get();

        if ($messages->isEmpty()) {
            return [
                'success' => false,
                'status_code' => 404,
                'message' => 'Chat instance not found.',
                'errors' => [
                    'chat' => ['Chat instance not found or you do not have permission to delete it.'],
                ],
            ];
        }

        DB::transaction(function () use ($messages, $user, $aiInstanceId) {
            foreach ($messages as $message) {
                if ((int) $message->msg_type === 2) {
                    $this->chatFileDeleteService->deleteFromPublicDisk($message->file_path);
                }
            }

            ChatMessage::where('user_id', $user->id)
                ->where('ai_instance_id', $aiInstanceId)
                ->delete();
        });

        return [
            'success' => true,
            'status_code' => 200,
            'message' => 'Chat deleted successfully.',
            'data' => [
                'ai_instance_id' => $aiInstanceId,
            ],
        ];
    }
}