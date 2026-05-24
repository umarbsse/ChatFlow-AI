<?php

namespace App\Events;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatMessageSent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public User $user,
        public int $aiInstanceId,
        public ?ChatMessage $userMessage = null,
        public ?ChatMessage $aiMessage = null,
        public ?ChatMessage $fileMessage = null
    ) {
        //
    }
}