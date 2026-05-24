<?php

namespace App\Http\Requests\Api\Chat;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class SendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'msg' => [
                'nullable',
                'string',
            ],

            'msg_type' => [
                'nullable',
                'integer',
                'in:1,2',
            ],

            'ai_instance_id' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'instance_title' => [
                'nullable',
                'string',
                'max:255',
            ],

            'file' => [
                'nullable',
                'file',
            ],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (!$this->filled('msg') && !$this->hasFile('file')) {
                $validator->errors()->add(
                    'msg',
                    'Please enter a message or upload a file.'
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            'msg.string' => 'Message must be a valid string.',

            'msg_type.integer' => 'Message type must be a valid number.',
            'msg_type.in' => 'Message type must be 1 for text or 2 for file.',

            'ai_instance_id.integer' => 'Chat instance ID must be a valid number.',
            'ai_instance_id.min' => 'Chat instance ID must be greater than zero.',

            'instance_title.string' => 'Instance title must be a valid string.',
            'instance_title.max' => 'Instance title may not be greater than 255 characters.',

            'file.file' => 'Uploaded item must be a valid file.',
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