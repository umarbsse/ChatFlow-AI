<?php

namespace App\Services\OpenAI;

class OpenAIResponseParser
{
    public function extractText(array $response): string
    {
        /*
         * Some OpenAI Responses API responses include:
         * output_text directly.
         */
        if (!empty($response['output_text']) && is_string($response['output_text'])) {
            return trim($response['output_text']);
        }

        /*
         * Responses API usually returns an output array.
         * Sometimes first item is a tool call, like web_search_call.
         * The actual assistant response is often an item with type=message.
         */
        foreach (($response['output'] ?? []) as $outputItem) {
            if (($outputItem['type'] ?? '') !== 'message') {
                continue;
            }

            foreach (($outputItem['content'] ?? []) as $contentItem) {
                if (!empty($contentItem['text']) && is_string($contentItem['text'])) {
                    return trim($contentItem['text']);
                }
            }
        }

        /*
         * Fallback: scan any output content for text.
         */
        foreach (($response['output'] ?? []) as $outputItem) {
            foreach (($outputItem['content'] ?? []) as $contentItem) {
                if (!empty($contentItem['text']) && is_string($contentItem['text'])) {
                    return trim($contentItem['text']);
                }
            }
        }

        return '';
    }
}