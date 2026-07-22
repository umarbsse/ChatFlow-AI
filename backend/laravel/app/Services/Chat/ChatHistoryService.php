<?php

namespace App\Services\Chat;

use App\Models\ChatMessage;
use App\Models\Config;

class ChatHistoryService
{
    public function getPreviousHistory(
        int $userId,
        int $aiInstanceId,
        bool $includeHistory = true
    ): array {
        if (!$includeHistory) {
            return [];
        }

        $historyLimit = (int) Config::value('CHATGPT_HISTORY_LIMIT', 15);

        $messages = ChatMessage::query()
            ->where('user_id', $userId)
            ->where('ai_instance_id', $aiInstanceId)
            ->orderBy('id', 'desc')
            ->limit($historyLimit)
            ->get()
            ->sortBy('id')
            ->values();

        $history = [];

        foreach ($messages as $message) {
            $item = $this->formatMessageForOpenAI($message);

            if ($item !== null) {
                $history[] = $item;
            }
        }

        return $this->applyReferenceLimit($history);
    }

    private function formatMessageForOpenAI(ChatMessage $message): ?array
    {
        $contentItem = null;

        if ((int) $message->chat_owner === 1) {
            if ((int) $message->msg_type === 1 && !empty($message->msg)) {
                $contentItem = [
                    'type' => 'input_text',
                    'text' => $message->msg,
                ];
            }

            if (
                (int) $message->msg_type === 2 &&
                !empty($message->chatgpt_file_id)
            ) {
                $contentItem = [
                    'type' => 'input_file',
                    'file_id' => $message->chatgpt_file_id,
                ];
            }

            if ($contentItem === null) {
                return null;
            }

            return [
                'role' => 'user',
                'content' => [$contentItem],
            ];
        }

        if ((int) $message->chat_owner === 2) {
            if ((int) $message->msg_type === 1 && !empty($message->msg)) {
                $contentItem = [
                    'type' => 'output_text',
                    'text' => $message->msg,
                ];
            }

            if ($contentItem === null) {
                return null;
            }

            return [
                'role' => 'assistant',
                'content' => [$contentItem],
            ];
        }

        return null;
    }

    private function applyReferenceLimit(array $history): array
    {
        $referenceLimit = (int) Config::value('CHATGPT_SEND_MSG_FOR_REFERENCE', 0);

        /*
         * 0 means use all loaded history.
         * Negative value like -10 means use last 10 items.
         * Positive value like 5 means skip first 5 items.
         */
        if ($referenceLimit === 0) {
            return $history;
        }

        return array_slice($history, $referenceLimit);
    }
}