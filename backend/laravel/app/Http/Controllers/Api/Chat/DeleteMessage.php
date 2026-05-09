<?php

namespace App\Http\Controllers\Api\Chat;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Throwable;

class DeleteMessage extends Controller
{
    public function __invoke(Request $request, int $messageId): JsonResponse
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

            $message = ChatMessage::where('id', $messageId)
                ->where('user_id', $user->id)
                ->first();

            if (!$message) {
                return response()->json([
                    'status' => false,
                    'message' => 'Message not found.',
                    'data' => null,
                    'errors' => [
                        'message' => ['Message not found or you do not have permission to delete it.'],
                    ],
                ], 404);
            }

            /*
             * If this message is a file message, also delete the local file.
             * msg_type = 2 means file.
             */
            if ((int) $message->msg_type === 2 && !empty($message->file_path)) {
                $filePath = $message->file_path;

                /*
                 * Your DB stores file_path like:
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

            $deletedMessageId = $message->id;
            $aiInstanceId = $message->ai_instance_id;

            $message->delete();

            return response()->json([
                'status' => true,
                'message' => 'Message deleted successfully.',
                'data' => [
                    'id' => $deletedMessageId,
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