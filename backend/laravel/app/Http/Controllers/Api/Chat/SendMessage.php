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
                'msg' => ['required', 'string'],
                'msg_type' => ['nullable', 'integer', 'in:1,2'],
                'ai_instance_id' => ['nullable', 'integer'],
                'instance_title' => ['nullable', 'string', 'max:255'],
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed.',
                    'data' => null,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $validated = $validator->validated();

            $result = DB::transaction(function () use ($user, $validated) {
                $aiInstanceId = $validated['ai_instance_id'] ?? null;

                if (!$aiInstanceId) {
                    $lastInstanceId = ChatMessage::where('user_id', $user->id)
                        ->max('ai_instance_id');

                    $aiInstanceId = $lastInstanceId ? $lastInstanceId + 1 : 1;
                }

                $instanceTitle = $validated['instance_title']
                    ?? ChatMessage::where('user_id', $user->id)
                        ->where('ai_instance_id', $aiInstanceId)
                        ->value('instance_title');

                if (!$instanceTitle) {
                    $instanceTitle = mb_substr($validated['msg'], 0, 60);
                }

                $userMessage = ChatMessage::create([
                    'user_id' => $user->id,
                    'chat_owner' => 1,
                    'ai_instance_id' => $aiInstanceId,
                    'instance_title' => $instanceTitle,
                    'msg' => $validated['msg'],
                    'msg_type' => $validated['msg_type'] ?? 1,
                    'file_name' => null,
                    'file_path' => null,
                    'file_full_path' => null,
                    'chatgpt_file_id' => null,
                    'ai_raw_response' => null,
                    'chatgpt_file_upload_response' => 0,
                    'added_at' => now(),
                ]);

                /*
                 * Later you can replace this with actual OpenAI response.
                 */
                $aiText = 'I received your message: ' . $validated['msg'];

                $aiMessage = ChatMessage::create([
                    'user_id' => $user->id,
                    'chat_owner' => 2,
                    'ai_instance_id' => $aiInstanceId,
                    'instance_title' => $instanceTitle,
                    'msg' => $aiText,
                    'msg_type' => 1,
                    'file_name' => null,
                    'file_path' => null,
                    'file_full_path' => null,
                    'chatgpt_file_id' => null,
                    'ai_raw_response' => json_encode([
                        'reply' => $aiText,
                    ]),
                    'chatgpt_file_upload_response' => 0,
                    'added_at' => now(),
                ]);

                return [
                    'ai_instance_id' => $aiInstanceId,
                    'user_message' => $userMessage,
                    'ai_message' => $aiMessage,
                ];
            });

            return response()->json([
                'status' => true,
                'message' => 'Message sent successfully.',
                'data' => [
                    'ai_instance_id' => $result['ai_instance_id'],
                    'user_message' => $result['user_message'],
                    'ai_message' => $result['ai_message'],
                ],
                'errors' => null,
            ], 200);
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