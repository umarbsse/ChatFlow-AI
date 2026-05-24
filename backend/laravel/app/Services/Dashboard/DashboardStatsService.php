<?php

namespace App\Services\Dashboard;

use App\Models\ChatMessage;
use Carbon\Carbon;

class DashboardStatsService
{
    public function getStats(int $userId): array
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();

        $totalChats = ChatMessage::where('user_id', $userId)
            ->distinct('ai_instance_id')
            ->count('ai_instance_id');

        $totalMessages = ChatMessage::where('user_id', $userId)->count();

        $fileMessages = ChatMessage::where('user_id', $userId)
            ->where('msg_type', 2)
            ->count();

        $aiMessages = ChatMessage::where('user_id', $userId)
            ->where('chat_owner', 2)
            ->count();

        $userMessages = ChatMessage::where('user_id', $userId)
            ->where('chat_owner', 1)
            ->count();

        $chatsToday = ChatMessage::where('user_id', $userId)
            ->whereDate('added_at', $today)
            ->distinct('ai_instance_id')
            ->count('ai_instance_id');

        $chatsYesterday = ChatMessage::where('user_id', $userId)
            ->whereDate('added_at', $yesterday)
            ->distinct('ai_instance_id')
            ->count('ai_instance_id');

        $messagesToday = ChatMessage::where('user_id', $userId)
            ->whereDate('added_at', $today)
            ->count();

        $messagesYesterday = ChatMessage::where('user_id', $userId)
            ->whereDate('added_at', $yesterday)
            ->count();

        $fileMessagesToday = ChatMessage::where('user_id', $userId)
            ->where('msg_type', 2)
            ->whereDate('added_at', $today)
            ->count();

        $fileMessagesYesterday = ChatMessage::where('user_id', $userId)
            ->where('msg_type', 2)
            ->whereDate('added_at', $yesterday)
            ->count();

        return [
            'stats' => [
                [
                    'id' => 1,
                    'title' => 'Total Chats',
                    'value' => number_format($totalChats),
                    'change' => $this->calculateChange($chatsToday, $chatsYesterday),
                    'icon' => 'fa-solid fa-comments',
                ],
                [
                    'id' => 2,
                    'title' => 'Chats Today',
                    'value' => number_format($chatsToday),
                    'change' => $this->calculateChange($chatsToday, $chatsYesterday),
                    'icon' => 'fa-solid fa-message',
                ],
                [
                    'id' => 3,
                    'title' => 'Total Messages',
                    'value' => number_format($totalMessages),
                    'change' => $this->calculateChange($messagesToday, $messagesYesterday),
                    'icon' => 'fa-solid fa-envelope',
                ],
                [
                    'id' => 4,
                    'title' => 'Files Uploaded',
                    'value' => number_format($fileMessages),
                    'change' => $this->calculateChange($fileMessagesToday, $fileMessagesYesterday),
                    'icon' => 'fa-solid fa-file-arrow-up',
                ],
            ],

            'daily_chats' => $this->getDailyChats($userId),

            'chat_categories' => $this->getChatCategories(
                $totalMessages,
                $userMessages,
                $aiMessages,
                $fileMessages
            ),

            'performance' => $this->getPerformance(
                $totalMessages,
                $userMessages,
                $aiMessages,
                $fileMessages
            ),

            'recent_activities' => $this->getRecentActivities($userId),
        ];
    }

    private function calculateChange(int $today, int $yesterday): string
    {
        if ($yesterday <= 0) {
            return $today > 0 ? '+100%' : '0%';
        }

        $change = (($today - $yesterday) / $yesterday) * 100;

        return ($change >= 0 ? '+' : '') . round($change, 1) . '%';
    }

    private function getDailyChats(int $userId): array
    {
        $startOfWeek = Carbon::now()->startOfWeek();

        $items = [];

        for ($i = 0; $i < 7; $i++) {
            $date = $startOfWeek->copy()->addDays($i);

            $count = ChatMessage::where('user_id', $userId)
                ->whereDate('added_at', $date)
                ->distinct('ai_instance_id')
                ->count('ai_instance_id');

            $items[] = [
                'day' => $date->format('D'),
                'chats' => $count,
            ];
        }

        return $items;
    }

    private function getChatCategories(int $totalMessages, int $userMessages, int $aiMessages, int $fileMessages): array {
        if ($totalMessages <= 0) {
            return [
                [
                    'title' => 'User Messages',
                    'value' => 0,
                    'icon' => 'fa-solid fa-user',
                ],
                [
                    'title' => 'AI Replies',
                    'value' => 0,
                    'icon' => 'fa-solid fa-robot',
                ],
                [
                    'title' => 'Files',
                    'value' => 0,
                    'icon' => 'fa-solid fa-file',
                ],
                [
                    'title' => 'Text',
                    'value' => 0,
                    'icon' => 'fa-solid fa-message',
                ],
            ];
        }

        $textMessages = max($totalMessages - $fileMessages, 0);

        return [
            [
                'title' => 'User Messages',
                'value' => round(($userMessages / $totalMessages) * 100),
                'icon' => 'fa-solid fa-user',
            ],
            [
                'title' => 'AI Replies',
                'value' => round(($aiMessages / $totalMessages) * 100),
                'icon' => 'fa-solid fa-robot',
            ],
            [
                'title' => 'Files',
                'value' => round(($fileMessages / $totalMessages) * 100),
                'icon' => 'fa-solid fa-file',
            ],
            [
                'title' => 'Text',
                'value' => round(($textMessages / $totalMessages) * 100),
                'icon' => 'fa-solid fa-message',
            ],
        ];
    }

    private function getPerformance(int $totalMessages, int $userMessages, int $aiMessages, int $fileMessages): array {
        return [
            [
                'title' => 'AI Replies',
                'value' => $totalMessages > 0
                    ? round(($aiMessages / $totalMessages) * 100) . '%'
                    : '0%',
                'icon' => 'fa-solid fa-robot',
            ],
            [
                'title' => 'User Messages',
                'value' => $totalMessages > 0
                    ? round(($userMessages / $totalMessages) * 100) . '%'
                    : '0%',
                'icon' => 'fa-solid fa-user',
            ],
            [
                'title' => 'File Messages',
                'value' => $totalMessages > 0
                    ? round(($fileMessages / $totalMessages) * 100) . '%'
                    : '0%',
                'icon' => 'fa-solid fa-file',
            ],
        ];
    }

    private function getRecentActivities(int $userId): array
    {
        return ChatMessage::where('user_id', $userId)
            ->orderBy('added_at', 'desc')
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($message) {
                $isUser = (int) $message->chat_owner === 1;
                $isFile = (int) $message->msg_type === 2;

                if ($isFile) {
                    $title = 'File uploaded';
                    $description = $message->file_name ?: 'Uploaded file';
                    $icon = 'fa-solid fa-file-arrow-up';
                } elseif ($isUser) {
                    $title = 'User sent message';
                    $description = $message->msg ?: 'Text message';
                    $icon = 'fa-solid fa-message';
                } else {
                    $title = 'AI replied';
                    $description = $message->msg ?: 'AI response';
                    $icon = 'fa-solid fa-robot';
                }

                return [
                    'id' => $message->id,
                    'title' => $title,
                    'description' => mb_substr($description, 0, 60),
                    'time' => Carbon::parse($message->added_at)->diffForHumans(),
                    'icon' => $icon,
                ];
            })
            ->toArray();
    }
}