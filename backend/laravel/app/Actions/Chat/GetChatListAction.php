<?php

namespace App\Actions\Chat;

use App\Models\User;
use App\Services\Chat\ChatListService;
use Illuminate\Support\Collection;

class GetChatListAction
{
    public function __construct(private ChatListService $chatListService) {
        //
    }

    public function execute(User $user): Collection
    {
        return $this->chatListService->getUserChats($user->id);
    }
}