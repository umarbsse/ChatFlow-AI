<?php

namespace App\Actions\Chat;

use App\Events\ChatMessageSent;
use App\Models\ChatMessage;
use App\Models\User;
use App\Services\Chat\ChatFileUploadService;
use App\Services\Chat\ChatInstanceService;
use App\Services\OpenAI\OpenAIChatService;
use App\Services\OpenAI\OpenAIFileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SendMessageAction
{
    public function __construct(
        private ChatFileUploadService $chatFileUploadService,
        private OpenAIFileService $openAIFileService,
        private OpenAIChatService $openAIChatService,
        private ChatInstanceService $chatInstanceService
    ) {
        //
    }

    public function execute(Request $request, User $user): array
    {
        return DB::transaction(function () use ($request, $user) {
            $instance = $this->chatInstanceService->resolve($request, $user);

            $aiInstanceId = $instance['ai_instance_id'];
            $aiInstanceTitle = $instance['instance_title'];

            $response = [];

            if ($request->hasFile('file') && $request->file('file')->isValid()) {
                $fileResponse = $this->handleFileMessage(
                    $request,
                    $user,
                    $aiInstanceId,
                    $aiInstanceTitle
                );

                $response = array_merge($response, $fileResponse);
            }

            if ($request->filled('msg')) {
                $textResponse = $this->handleTextMessage(
                    $request,
                    $user,
                    $aiInstanceId,
                    $aiInstanceTitle
                );

                $response = array_merge($response, $textResponse);
            }

            $response['ai_instance_id'] = $aiInstanceId;
            $response['instance_title'] = $aiInstanceTitle;

            event(new ChatMessageSent(
                user: $user,
                aiInstanceId: $aiInstanceId,
                userMessage: $response['user_message'] ?? null,
                aiMessage: $response['ai_message'] ?? null,
                fileMessage: $response['file_message'] ?? null
            ));

            return $response;
        });
    }

    private function handleFileMessage(
        Request $request,
        User $user,
        int $aiInstanceId,
        string $aiInstanceTitle
    ): array {
        $data = $this->chatFileUploadService->upload($request, 'file');

        if (($data['is_file_upload'] ?? false) !== true) {
            return [
                'file_upload' => [
                    'success' => false,
                    'error' => $data['error'] ?? 'File upload failed.',
                ],
            ];
        }

        $fileRow = [
            'user_id' => $user->id,
            'chat_owner' => 1,
            'ai_instance_id' => $aiInstanceId,
            'instance_title' => $aiInstanceTitle,

            'msg' => '',
            'msg_type' => 2,

            'file_full_path' => $data['upload_data']['full_path'],
            'file_name' => $data['upload_data']['file_name'],
            'file_path' => $data['upload_data']['file_path'],

            'chatgpt_file_upload_response' => 0,
            'chatgpt_file_id' => '',
            'ai_raw_response' => null,

            'added_at' => now(),
        ];

        $chatGptRes = $this->openAIFileService->upload($fileRow['file_full_path']);

        $fileRow['chatgpt_file_upload_response'] = !empty($chatGptRes['success']) ? 1 : 0;
        $fileRow['chatgpt_file_id'] = $chatGptRes['file_id'] ?? '';
        $fileRow['ai_raw_response'] = json_encode(
            $chatGptRes,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
        );

        $fileMessage = ChatMessage::create($fileRow);

        $response = [
            'file_message' => $fileMessage,
            'file_upload' => $chatGptRes,
        ];

        if (empty($chatGptRes['success'])) {
            $aiErrorMessage = ChatMessage::create([
                'user_id' => $user->id,
                'chat_owner' => 2,
                'ai_instance_id' => $aiInstanceId,
                'instance_title' => $aiInstanceTitle,

                'msg' => $chatGptRes['error'] ?? 'File upload failed.',
                'msg_type' => 1,

                'file_name' => null,
                'file_path' => null,
                'file_full_path' => null,

                'chatgpt_file_id' => null,
                'chatgpt_file_upload_response' => 0,

                'ai_raw_response' => json_encode(
                    $chatGptRes,
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                ),

                'added_at' => now(),
            ]);

            $response['ai_message'] = $aiErrorMessage;
        }

        return $response;
    }

    private function handleTextMessage(
        Request $request,
        User $user,
        int $aiInstanceId,
        string $aiInstanceTitle
    ): array {
        $userMsg = $request->input('msg');

        $userMessage = ChatMessage::create([
            'user_id' => $user->id,
            'chat_owner' => 1,
            'ai_instance_id' => $aiInstanceId,
            'instance_title' => $aiInstanceTitle,

            'msg' => $userMsg,
            'msg_type' => 1,

            'file_name' => null,
            'file_path' => null,
            'file_full_path' => null,

            'chatgpt_file_id' => null,
            'chatgpt_file_upload_response' => 0,
            'ai_raw_response' => null,

            'added_at' => now(),
        ]);

        $aiResponse = $this->openAIChatService->sendMessage(
            $user,
            $userMsg,
            $aiInstanceId,
            true
        );

        $aiMessage = ChatMessage::create([
            'user_id' => $user->id,
            'chat_owner' => 2,
            'ai_instance_id' => $aiInstanceId,
            'instance_title' => $aiInstanceTitle,

            'msg' => $aiResponse['text'] ?? '',
            'msg_type' => 1,

            'file_name' => null,
            'file_path' => null,
            'file_full_path' => null,

            'chatgpt_file_id' => null,
            'chatgpt_file_upload_response' => 0,
            'ai_raw_response' => $aiResponse['json'] ?? null,

            'added_at' => now(),
        ]);

        return [
            'user_message' => $userMessage,
            'msg' => $aiResponse,
            'ai_message' => $aiMessage,
        ];
    }
}