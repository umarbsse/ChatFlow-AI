<?php

namespace App\Actions\Chat;

use App\Models\ChatMessage;
use App\Models\User;
use App\Services\Chat\ChatFileDeleteService;

class DeleteMessageAction
{
    public function __construct(
        private ChatFileDeleteService $chatFileDeleteService
    ) {
        //
    }

    public function execute(User $user, int $messageId): array
    {
        $message = ChatMessage::where('id', $messageId)
            ->where('user_id', $user->id)
            ->first();

        if (!$message) {
            return [
                'success' => false,
                'status_code' => 404,
                'message' => 'Message not found.',
                'errors' => [
                    'message' => ['Message not found or you do not have permission to delete it.'],
                ],
            ];
        }

        if ((int) $message->msg_type === 2) {
            $this->chatFileDeleteService->deleteFromPublicDisk($message->file_path);
        }

        $deletedMessageId = $message->id;
        $aiInstanceId = $message->ai_instance_id;

        $message->delete();

        return [
            'success' => true,
            'status_code' => 200,
            'message' => 'Message deleted successfully.',
            'data' => [
                'id' => $deletedMessageId,
                'ai_instance_id' => $aiInstanceId,
            ],
        ];
    }
}