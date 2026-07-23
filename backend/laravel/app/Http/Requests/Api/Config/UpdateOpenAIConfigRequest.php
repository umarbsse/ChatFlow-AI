<?php

namespace App\Http\Requests\Api\Config;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateOpenAIConfigRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'OPENAI_API_KEY' => ['nullable', 'string'],
            'OPENAI_MODEL' => ['required', 'string', 'max:100'],
            'OPENAI_TITLE_MODEL' => ['required', 'string', 'max:100'],

            'CHATGPT_ROLE' => ['required', 'string', 'max:50'],
            'CHATGPT_ROLE_CONTENT' => ['required', 'string'],

            'CHATGPT_TEMPERATURE' => ['required', 'numeric', 'min:0', 'max:2'],
            'CHATGPT_TITLE_TEMPERATURE' => ['required', 'numeric', 'min:0', 'max:2'],

            'CHATGPT_TITLE_MAX_TOKENS' => ['required', 'integer', 'min:1', 'max:1000'],
            'CHATGPT_HISTORY_LIMIT' => ['required', 'integer', 'min:0', 'max:100'],
            'CHATGPT_SEND_MSG_FOR_REFERENCE' => ['required', 'integer', 'min:-100', 'max:100'],

            'CHATGPT_TOOL_TYPE' => ['required', 'string', 'in:web_search,file_search'],
            'CHATGPT_SEARCH_CONTEXT_SIZE' => ['required', 'string', 'in:low,medium,high'],

            'CHATGPT_CURL_TIMEOUT' => ['required', 'integer', 'min:1', 'max:10000'],
            'OPENAI_FILE_PURPOSE' => ['required', 'string', 'max:100'],
            'VACANCY_AI_PROMPT' => ['nullable', 'string'],
            'VACANCY_ORIGINAL_RESUME_LATEX' => ['nullable', 'string'],
            'LATEX_BINARY' => ['required', 'string', 'max:2048'],
            'LATEX_COMPILE_TIMEOUT' => ['required', 'integer', 'min:10', 'max:3600'],
        ];
    }

    public function messages(): array
    {
        return [
            'OPENAI_MODEL.required' => 'OpenAI model is required.',
            'OPENAI_TITLE_MODEL.required' => 'OpenAI title model is required.',
            'CHATGPT_ROLE.required' => 'ChatGPT role is required.',
            'CHATGPT_ROLE_CONTENT.required' => 'ChatGPT role content is required.',
            'CHATGPT_TEMPERATURE.required' => 'ChatGPT temperature is required.',
            'CHATGPT_TITLE_TEMPERATURE.required' => 'ChatGPT title temperature is required.',
            'CHATGPT_TITLE_MAX_TOKENS.required' => 'Title max tokens is required.',
            'CHATGPT_HISTORY_LIMIT.required' => 'History limit is required.',
            'CHATGPT_SEND_MSG_FOR_REFERENCE.required' => 'Reference message limit is required.',
            'CHATGPT_TOOL_TYPE.required' => 'Tool type is required.',
            'CHATGPT_SEARCH_CONTEXT_SIZE.required' => 'Search context size is required.',
            'CHATGPT_CURL_TIMEOUT.required' => 'cURL timeout is required.',
            'OPENAI_FILE_PURPOSE.required' => 'OpenAI file purpose is required.',
            'LATEX_BINARY.required' => 'LaTeX binary path is required.',
            'LATEX_COMPILE_TIMEOUT.required' => 'LaTeX compile timeout is required.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'status' => false,
                'message' => 'Validation failed.',
                'data' => null,
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}