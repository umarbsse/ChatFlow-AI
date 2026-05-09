<?php

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

if (!function_exists('ai_chat_file_upload_base_path')) {
    function ai_chat_file_upload_base_path(): string
    {
        return 'chat_uploads/';
    }
}

if (!function_exists('ai_chat_file_upload_laravel')) {
    function ai_chat_file_upload_laravel(Request $request, string $fileName): array
    {
        $data = [
            'is_file_upload' => false,
        ];

        if (!$request->hasFile($fileName)) {
            $data['error'] = 'No file uploaded.';
            return $data;
        }

        $file = $request->file($fileName);

        if (!$file->isValid()) {
            $data['error'] = 'Invalid uploaded file.';
            return $data;
        }

        $uploadRelativePath = ai_chat_file_upload_base_path();

        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();

        $safeName = pathinfo($originalName, PATHINFO_FILENAME);
        $safeName = Str::slug($safeName);

        if (!$safeName) {
            $safeName = 'file';
        }

        $newFileName = $safeName . '-' . time() . '-' . Str::random(8);

        if ($extension) {
            $newFileName .= '.' . $extension;
        }

        /*
         * Stores file in:
         * storage/app/public/chat_uploads/{file_name}
         */
        $storedPath = $file->storeAs(
            $uploadRelativePath,
            $newFileName,
            'public'
        );

        $fullPath = storage_path('app/public/' . $storedPath);
        $publicPath = 'storage/' . $storedPath;

        $data['is_file_upload'] = true;
        $data['upload_data'] = [
            'file_name' => $newFileName,
            'client_name' => $originalName,
            'file_path' => $publicPath,
            'full_path' => $fullPath,
        ];

        return $data;
    }
}

if (!function_exists('get_chat_instance_id_laravel')) {
    function get_chat_instance_id_laravel(int $userId, ?string $msg = null): array
    {
        $result = [
            'instance_id' => 0,
            'instance_title' => '',
        ];

        $lastInstance = ChatMessage::where('user_id', $userId)
            ->orderBy('ai_instance_id', 'desc')
            ->first();

        if (!$lastInstance) {
            $result['instance_id'] = 1;
        } else {
            $result['instance_id'] = ((int) $lastInstance->ai_instance_id) + 1;
        }

        $result['instance_title'] = create_chat_instance_title_laravel($msg);

        return $result;
    }
}

if (!function_exists('create_chat_instance_title_laravel')) {
    function create_chat_instance_title_laravel(?string $msg = null): string
    {
        /*
         * If this chat starts with a file, use random file title.
         */
        if (request()->hasFile('file') && request()->file('file')->isValid()) {
            return getRandomTitle();
        }

        $msg = trim((string) $msg);

        if ($msg === '') {
            return 'New Chat';
        }

        /*
         * Use title-only OpenAI request.
         * No web search tools here.
         */
        $titleResponse = chatgpt_generate_instance_title($msg);

        if (!empty($titleResponse['success']) && !empty($titleResponse['title'])) {
            return clean_chat_instance_title($titleResponse['title']);
        }

        return create_fallback_chat_title($msg);
    }
}

if (!function_exists('chatgpt_generate_instance_title')) {
    function chatgpt_generate_instance_title(string $msg): array
    {
        $openaiKey = get_chatgpt_api_key();

        if (!$openaiKey) {
            return [
                'success' => false,
                'title' => '',
                'error' => 'Missing API key',
            ];
        }

        $prompt = "Create a short chat title for this user message.

Rules:
- Return only the title.
- Use 2 to 5 words.
- Do not use quotes.
- Do not use markdown.
- Do not add a period.
- If this is a news/web-search request, make a topic title from the request.

User message:
" . $msg;

        $data = [
            'model' => env('OPENAI_TITLE_MODEL', env('OPENAI_MODEL', 'gpt-4.1-mini')),
            'input' => [
                [
                    'role' => 'system',
                    'content' => [
                        [
                            'type' => 'input_text',
                            'text' => 'You generate very short chat titles only.',
                        ],
                    ],
                ],
                [
                    'role' => 'user',
                    'content' => [
                        [
                            'type' => 'input_text',
                            'text' => $prompt,
                        ],
                    ],
                ],
            ],
            'temperature' => (float) env('CHATGPT_TITLE_TEMPERATURE', 0.2),
            'max_output_tokens' => (int) env('CHATGPT_TITLE_MAX_TOKENS', 20),
        ];

        $ch = curl_init('https://api.openai.com/v1/responses');

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_TIMEOUT => (int) env('CHATGPT_CURL_TIMEOUT', 120),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $openaiKey,
            ],
            CURLOPT_POSTFIELDS => json_encode($data),
        ]);

        $apiResponse = curl_exec($ch);

        if (curl_errno($ch)) {
            $error = curl_error($ch);
            curl_close($ch);

            return [
                'success' => false,
                'title' => '',
                'error' => 'cURL Error: ' . $error,
                'request_data' => $data,
            ];
        }

        curl_close($ch);

        $result = json_decode($apiResponse, true);

        if (!$result) {
            return [
                'success' => false,
                'title' => '',
                'error' => 'Invalid JSON',
                'raw' => $apiResponse,
                'request_data' => $data,
            ];
        }

        if (isset($result['error'])) {
            return [
                'success' => false,
                'title' => '',
                'error' => $result['error']['message'] ?? 'Title generation failed.',
                'raw' => $result,
                'request_data' => $data,
            ];
        }

        $title = extract_chatgpt_reply_text($result);

        if ($title === '') {
            return [
                'success' => false,
                'title' => '',
                'error' => 'No title text found in response.',
                'raw' => $result,
                'request_data' => $data,
            ];
        }

        return [
            'success' => true,
            'title' => $title,
            'raw' => $result,
            'request_data' => $data,
        ];
    }
}

if (!function_exists('clean_chat_instance_title')) {
    function clean_chat_instance_title(string $title): string
    {
        $title = trim($title);

        $title = str_replace(["\r", "\n"], ' ', $title);
        $title = preg_replace('/\*\*(.*?)\*\*/', '$1', $title);
        $title = preg_replace('/^title\s*:\s*/i', '', $title);
        $title = trim($title, " \t\n\r\0\x0B\"'`*.-:");

        $title = preg_replace('/\s+/', ' ', $title);

        $words = preg_split('/\s+/', $title);

        if (count($words) > 6) {
            $title = implode(' ', array_slice($words, 0, 6));
        }

        if ($title === '') {
            return 'New Chat';
        }

        return mb_substr($title, 0, 80);
    }
}

if (!function_exists('create_fallback_chat_title')) {
    function create_fallback_chat_title(string $msg): string
    {
        $msg = trim($msg);

        if ($msg === '') {
            return 'New Chat';
        }

        $clean = strtolower($msg);

        $removePhrases = [
            'give me',
            'tell me',
            'show me',
            'write me',
            'create',
            'generate',
            'latest news about',
            'latest news',
            'news about',
            'from multiple sources',
            'multiple sources',
            'summary',
            'summarize',
            'please',
            'bellow',
            'below',
            'prompt',
        ];

        foreach ($removePhrases as $phrase) {
            $clean = str_replace($phrase, '', $clean);
        }

        $clean = preg_replace('/[^a-z0-9\s\/-]/i', ' ', $clean);
        $clean = preg_replace('/\s+/', ' ', $clean);
        $clean = trim($clean);

        if ($clean === '') {
            return 'New Chat';
        }

        $words = preg_split('/\s+/', $clean);
        $title = implode(' ', array_slice($words, 0, 5));

        return ucwords($title);
    }
}

if (!function_exists('getRandomTitle')) {
    function getRandomTitle(): string
    {
        $titles = [
            'File for Analysis',
            'Upload for Review',
            'File for Scanning',
            'Analysis File Upload',
            'Uploaded for Review',
            'File Ready Review',
        ];

        return $titles[array_rand($titles)];
    }
}

if (!function_exists('get_chatgpt_api_key')) {
    function get_chatgpt_api_key(): ?string
    {
        return env('OPENAI_API_KEY');
    }
}

if (!function_exists('get_the_previous_chat_history')) {
    function get_the_previous_chat_history(int $instanceId, bool $includeHistory): array
    {
        $data = [];

        if ($instanceId <= 0) {
            return $data;
        }

        if ($includeHistory !== true) {
            return $data;
        }

        $userId = auth()->id();

        if (!$userId) {
            return $data;
        }

        $result = ChatMessage::where('ai_instance_id', $instanceId)
            ->where('user_id', $userId)
            ->orderBy('id', 'desc')
            ->limit((int) env('CHATGPT_HISTORY_LIMIT', 15))
            ->get()
            ->sortBy('id')
            ->values();

        foreach ($result as $item) {
            $temp = [
                'role' => ((int) $item->chat_owner === 1) ? 'user' : 'assistant',
                'content' => [],
            ];

            $temp1 = [];

            if ((int) $item->chat_owner === 1) {
                if ((int) $item->msg_type === 1 && !empty($item->msg)) {
                    $temp1 = [
                        'type' => 'input_text',
                        'text' => $item->msg,
                    ];
                } elseif ((int) $item->msg_type === 2 && !empty($item->chatgpt_file_id)) {
                    $temp1 = [
                        'type' => 'input_file',
                        'file_id' => $item->chatgpt_file_id,
                    ];
                }
            } elseif ((int) $item->chat_owner === 2) {
                if ((int) $item->msg_type === 1 && !empty($item->msg)) {
                    $temp1 = [
                        'type' => 'output_text',
                        'text' => $item->msg,
                    ];
                }
            }

            if (!empty($temp1)) {
                $temp['content'][] = $temp1;
                $data[] = $temp;
            }
        }

        return $data;
    }
}

if (!function_exists('chatgpt_upload_file')) {
    function chatgpt_upload_file(string $fileFullPath): array
    {
        $openaiKey = get_chatgpt_api_key();

        if (!$openaiKey) {
            return [
                'success' => false,
                'error' => 'Missing API key',
                'file_id' => '',
            ];
        }

        if (!file_exists($fileFullPath)) {
            return [
                'success' => false,
                'error' => 'File does not exist on server.',
                'file_id' => '',
                'full_path' => $fileFullPath,
            ];
        }

        $ch = curl_init('https://api.openai.com/v1/files');

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_TIMEOUT => (int) env('CHATGPT_CURL_TIMEOUT', 120),
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $openaiKey,
            ],
            CURLOPT_POSTFIELDS => [
                'purpose' => 'assistants',
                'file' => new CURLFile($fileFullPath),
            ],
        ]);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            $error = curl_error($ch);
            curl_close($ch);

            return [
                'success' => false,
                'error' => 'cURL Error: ' . $error,
                'file_id' => '',
                'raw' => null,
            ];
        }

        curl_close($ch);

        $result = json_decode($response, true);

        if (!$result) {
            return [
                'success' => false,
                'error' => 'Invalid JSON',
                'file_id' => '',
                'raw' => $response,
            ];
        }

        if (isset($result['error'])) {
            return [
                'success' => false,
                'error' => $result['error']['message'] ?? 'File upload failed.',
                'file_id' => '',
                'raw' => $result,
            ];
        }

        return [
            'success' => true,
            'error' => '',
            'file_id' => $result['id'] ?? '',
            'raw' => $result,
        ];
    }
}

if (!function_exists('extract_chatgpt_reply_text')) {
    function extract_chatgpt_reply_text(array $result): string
    {
        if (!empty($result['output_text'])) {
            return trim($result['output_text']);
        }

        if (!empty($result['output']) && is_array($result['output'])) {
            foreach ($result['output'] as $outputItem) {
                if (($outputItem['type'] ?? '') !== 'message') {
                    continue;
                }

                if (empty($outputItem['content']) || !is_array($outputItem['content'])) {
                    continue;
                }

                foreach ($outputItem['content'] as $contentItem) {
                    if (($contentItem['type'] ?? '') === 'output_text' && !empty($contentItem['text'])) {
                        return trim($contentItem['text']);
                    }

                    if (!empty($contentItem['text'])) {
                        return trim($contentItem['text']);
                    }
                }
            }
        }

        if (!empty($result['output']) && is_array($result['output'])) {
            foreach ($result['output'] as $outputItem) {
                if (empty($outputItem['content']) || !is_array($outputItem['content'])) {
                    continue;
                }

                foreach ($outputItem['content'] as $contentItem) {
                    if (!empty($contentItem['text'])) {
                        return trim($contentItem['text']);
                    }
                }
            }
        }

        return '';
    }
}

if (!function_exists('chatgpt_send_msg')) {
    function chatgpt_send_msg(string $msg, int $instanceId, bool $includeHistory): array
    {
        $openaiKey = get_chatgpt_api_key();

        if (!$openaiKey) {
            return [
                'success' => false,
                'error' => 'Missing API key',
            ];
        }

        $chatHistory = get_the_previous_chat_history($instanceId, $includeHistory);

        /*
         * Controller already inserts the current user message before AI call.
         * This prevents sending the same message twice.
         */
        $shouldAddCurrentMessage = true;

        if (!empty($chatHistory)) {
            $lastMessage = end($chatHistory);

            if (
                isset($lastMessage['role']) &&
                $lastMessage['role'] === 'user' &&
                isset($lastMessage['content'][0]['type']) &&
                $lastMessage['content'][0]['type'] === 'input_text' &&
                isset($lastMessage['content'][0]['text']) &&
                trim($lastMessage['content'][0]['text']) === trim($msg)
            ) {
                $shouldAddCurrentMessage = false;
            }
        }

        if ($msg && $shouldAddCurrentMessage) {
            $chatHistory[] = [
                'role' => 'user',
                'content' => [
                    [
                        'type' => 'input_text',
                        'text' => $msg,
                    ],
                ],
            ];
        }

        $referenceLimit = (int) env('CHATGPT_SEND_MSG_FOR_REFERENCE', 0);

        if ($referenceLimit !== 0) {
            $chatHistory = array_slice($chatHistory, $referenceLimit);
        }

        $system = [
            'role' => env('CHATGPT_ROLE', 'system'),
            'content' => [
                [
                    'type' => 'input_text',
                    'text' => env('CHATGPT_ROLE_CONTENT', 'You are a helpful assistant.'),
                ],
            ],
        ];

        $input = array_merge([$system], $chatHistory);

        $data = [
            'model' => env('OPENAI_MODEL', 'gpt-4.1-mini'),
            'input' => $input,
            'temperature' => (float) env('CHATGPT_TEMPERATURE', 0.2),
            'tools' => [
                [
                    'type' => env('CHATGPT_TOOL_TYPE', 'web_search'),
                    'search_context_size' => env('CHATGPT_SEARCH_CONTEXT_SIZE', 'medium'),
                ],
            ],
        ];

        $ch = curl_init('https://api.openai.com/v1/responses');

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_TIMEOUT => (int) env('CHATGPT_CURL_TIMEOUT', 120),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $openaiKey,
            ],
            CURLOPT_POSTFIELDS => json_encode($data),
        ]);

        $apiResponse = curl_exec($ch);

        if (curl_errno($ch)) {
            $error = curl_error($ch);
            curl_close($ch);

            return [
                'success' => false,
                'error' => 'cURL Error: ' . $error,
                'request_data' => $data,
            ];
        }

        curl_close($ch);

        $result = json_decode($apiResponse, true);

        if (!$result) {
            return [
                'success' => false,
                'error' => 'Invalid JSON',
                'raw' => $apiResponse,
                'request_data' => $data,
            ];
        }

        if (isset($result['error'])) {
            return [
                'success' => false,
                'error' => $result['error']['message'] ?? 'OpenAI response error.',
                'raw' => $result,
                'request_data' => $data,
            ];
        }

        $reply = extract_chatgpt_reply_text($result);

        if ($reply === '') {
            return [
                'success' => false,
                'error' => 'OpenAI response completed, but no assistant text was found.',
                'raw' => $result,
                'request_data' => $data,
            ];
        }

        return [
            'success' => true,
            'reply' => $reply,
            'raw' => $result,
            'request_data' => $data,
        ];
    }
}

if (!function_exists('get_the_ai_cleaned_response')) {
    function get_the_ai_cleaned_response(string $msg, int $aiInstanceId, bool $includeHistory = true): array
    {
        $chatGptResponse = chatgpt_send_msg($msg, $aiInstanceId, $includeHistory);

        if (empty($chatGptResponse['success'])) {
            $text = $chatGptResponse['error'] ?? 'Unable to get AI response.';

            return [
                'text' => $text,
                'json' => json_encode(
                    $chatGptResponse,
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                ),
            ];
        }

        return [
            'text' => $chatGptResponse['reply'] ?? '',
            'json' => json_encode(
                $chatGptResponse,
                JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
            ),
        ];
    }
}