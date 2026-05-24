<?php

namespace App\Listeners;

use App\Events\ChatMessageSent;
use App\Jobs\LogChatMessageSentJob;

class LogChatMessageSent
{
    public function handle(ChatMessageSent $event): void
    {
        LogChatMessageSentJob::dispatch(
            userId: $event->user->id,
            aiInstanceId: $event->aiInstanceId,
            userMessageId: $event->userMessage?->id,
            aiMessageId: $event->aiMessage?->id,
            fileMessageId: $event->fileMessage?->id
        );
    }
}