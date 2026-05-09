<?php

namespace App\Http\Controllers\Api\Chat;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Throwable;

class SendMessage extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthenticated.',
                    'data' => null,
                    'errors' => [
                        'auth' => ['User is not authenticated.'],
                    ],
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'msg' => ['nullable', 'string'],
                'msg_type' => ['nullable', 'integer', 'in:1,2'],
                'ai_instance_id' => ['nullable', 'integer'],
                'instance_title' => ['nullable', 'string', 'max:255'],
                'file' => ['nullable', 'file'],
            ]);

            $validator->after(function ($validator) use ($request) {
                if (!$request->filled('msg') && !$request->hasFile('file')) {
                    $validator->errors()->add('msg', 'Message or file is required.');
                }
            });

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed.',
                    'data' => null,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $response = DB::transaction(function () use ($request, $user) {
                if ($request->filled('ai_instance_id')) {
                    $aiInstanceId = (int) $request->input('ai_instance_id');

                    $aiInstanceTitle = $request->input('instance_title');

                    if (!$aiInstanceTitle) {
                        $aiInstanceTitle = ChatMessage::where('user_id', $user->id)
                            ->where('ai_instance_id', $aiInstanceId)
                            ->value('instance_title');
                    }

                    if (!$aiInstanceTitle) {
                        $aiInstanceTitle = 'New Chat';
                    }
                } else {
                    $instance = get_chat_instance_id_laravel(
                        $user->id,
                        $request->input('msg')
                    );

                    $aiInstanceId = $instance['instance_id'];
                    $aiInstanceTitle = $instance['instance_title'];
                }

                $response = [];

                /*
                 * FILE MESSAGE FLOW
                 */
                if ($request->hasFile('file') && $request->file('file')->isValid()) {
                    $data = ai_chat_file_upload_laravel($request, 'file');

                    if ($data['is_file_upload'] === true) {
                        $row1 = [
                            'user_id' => $user->id,
                            'msg' => '',
                            'msg_type' => 2,

                            'file_full_path' => $data['upload_data']['full_path'],
                            'file_name' => $data['upload_data']['file_name'],
                            'file_path' => $data['upload_data']['file_path'],

                            'chat_owner' => 1,
                            'ai_instance_id' => $aiInstanceId,
                            'instance_title' => $aiInstanceTitle,

                            'chatgpt_file_upload_response' => 0,
                            'chatgpt_file_id' => '',
                            'ai_raw_response' => null,

                            'added_at' => now(),
                        ];

                        $chatGptRes = chatgpt_upload_file($row1['file_full_path']);

                        $row1['chatgpt_file_upload_response'] = !empty($chatGptRes['success']) ? 1 : 0;
                        $row1['chatgpt_file_id'] = $chatGptRes['file_id'] ?? '';
                        $row1['ai_raw_response'] = json_encode(
                            $chatGptRes,
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        );

                        $fileMessage = ChatMessage::create($row1);

                        $response['file_message'] = $fileMessage;
                        $response['file_upload'] = $chatGptRes;

                        if (empty($chatGptRes['success'])) {
                            $row3 = [
                                'user_id' => $user->id,
                                'msg' => $chatGptRes['error'] ?? 'File upload failed.',
                                'ai_raw_response' => json_encode(
                                    $chatGptRes,
                                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                                ),
                                'msg_type' => 1,
                                'chat_owner' => 2,
                                'ai_instance_id' => $aiInstanceId,
                                'instance_title' => $aiInstanceTitle,

                                'file_name' => null,
                                'file_path' => null,
                                'file_full_path' => null,
                                'chatgpt_file_id' => null,
                                'chatgpt_file_upload_response' => 0,

                                'added_at' => now(),
                            ];

                            $aiErrorMessage = ChatMessage::create($row3);

                            $response['ai_message'] = $aiErrorMessage;
                        }
                    } else {
                        $response['file_upload'] = [
                            'success' => false,
                            'error' => $data['error'] ?? 'File upload failed.',
                        ];
                    }
                }

                /*
                 * TEXT MESSAGE FLOW
                 */
                if ($request->filled('msg')) {
                    $userMsg = $request->input('msg');

                    $row2 = [
                        'user_id' => $user->id,
                        'ai_instance_id' => $aiInstanceId,
                        'instance_title' => $aiInstanceTitle,
                        'msg' => $userMsg,
                        'msg_type' => 1,
                        'chat_owner' => 1,

                        'file_name' => null,
                        'file_path' => null,
                        'file_full_path' => null,
                        'chatgpt_file_id' => null,
                        'ai_raw_response' => null,
                        'chatgpt_file_upload_response' => 0,

                        'added_at' => now(),
                    ];

                    $userMessage = ChatMessage::create($row2);

                    $response['user_message'] = $userMessage;

                    $aiResponse = get_the_ai_cleaned_response(
                        $userMsg,
                        $aiInstanceId,
                        true
                    );

                    $row3 = [
                        'user_id' => $user->id,
                        'msg' => $aiResponse['text'] ?? '',
                        'ai_raw_response' => $aiResponse['json'] ?? null,
                        'msg_type' => 1,
                        'chat_owner' => 2,
                        'ai_instance_id' => $aiInstanceId,
                        'instance_title' => $aiInstanceTitle,

                        'file_name' => null,
                        'file_path' => null,
                        'file_full_path' => null,
                        'chatgpt_file_id' => null,
                        'chatgpt_file_upload_response' => 0,

                        'added_at' => now(),
                    ];

                    $aiMessage = ChatMessage::create($row3);

                    $response['msg'] = $aiResponse;
                    $response['ai_message'] = $aiMessage;
                }

                $response['ai_instance_id'] = $aiInstanceId;

                return $response;
            });

            return response()->json([
                'status' => true,
                'message' => 'Message sent successfully.',
                'data' => $response,
                'errors' => null,
            ], 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong. Please try again.',
                'data' => null,
                'errors' => [
                    'server' => [$e->getMessage()],
                ],
            ], 500);
        }
    }
}