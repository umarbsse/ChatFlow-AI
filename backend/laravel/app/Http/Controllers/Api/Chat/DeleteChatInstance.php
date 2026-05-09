<?php

namespace App\Http\Controllers\Api\Chat;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class DeleteChatInstance extends Controller
{
    public function __invoke(Request $request, int $aiInstanceId): JsonResponse
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

            $messages = ChatMessage::where('user_id', $user->id)
                ->where('ai_instance_id', $aiInstanceId)
                ->get();

            if ($messages->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Chat instance not found.',
                    'data' => null,
                    'errors' => [
                        'chat' => ['Chat instance not found or you do not have permission to delete it.'],
                    ],
                ], 404);
            }

            DB::transaction(function () use ($messages, $user, $aiInstanceId) {
                foreach ($messages as $message) {
                    if ((int) $message->msg_type === 2 && !empty($message->file_path)) {
                        $filePath = $message->file_path;

                        /*
                         * DB file_path example:
                         * storage/chat_uploads/file-name.pdf
                         *
                         * Laravel public disk expects:
                         * chat_uploads/file-name.pdf
                         */
                        $filePath = str_replace('\\', '/', $filePath);
                        $filePath = preg_replace('#/+#', '/', $filePath);
                        $filePath = ltrim($filePath, '/');

                        if (str_starts_with($filePath, 'storage/')) {
                            $filePath = substr($filePath, strlen('storage/'));
                        }

                        if ($filePath && Storage::disk('public')->exists($filePath)) {
                            Storage::disk('public')->delete($filePath);
                        }
                    }
                }

                ChatMessage::where('user_id', $user->id)
                    ->where('ai_instance_id', $aiInstanceId)
                    ->delete();
            });

            return response()->json([
                'status' => true,
                'message' => 'Chat deleted successfully.',
                'data' => [
                    'ai_instance_id' => $aiInstanceId,
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