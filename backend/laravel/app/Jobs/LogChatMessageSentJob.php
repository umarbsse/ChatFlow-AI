<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class LogChatMessageSentJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public int $userId,
        public int $aiInstanceId,
        public ?int $userMessageId = null,
        public ?int $aiMessageId = null,
        public ?int $fileMessageId = null
    ) {
        //
    }

    public function handle(): void
    {
        Log::info('Chat message sent.', [
            'user_id' => $this->userId,
            'ai_instance_id' => $this->aiInstanceId,

            'user_message_id' => $this->userMessageId,
            'ai_message_id' => $this->aiMessageId,
            'file_message_id' => $this->fileMessageId,

            'has_user_message' => $this->userMessageId !== null,
            'has_ai_message' => $this->aiMessageId !== null,
            'has_file_message' => $this->fileMessageId !== null,

            'logged_at' => now()->toDateTimeString(),
        ]);
    }
}