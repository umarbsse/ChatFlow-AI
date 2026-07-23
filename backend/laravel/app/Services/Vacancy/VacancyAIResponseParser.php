<?php

namespace App\Services\Vacancy;

use JsonException;

class VacancyAIResponseParser
{
    /**
     * Extract the updated LaTeX document from the JSON returned by OpenAI.
     */
    public function extractUpdatedLatexCode(?string $rawResponse): ?string
    {
        $rawResponse = trim((string) $rawResponse);

        if ($rawResponse === '') {
            return null;
        }

        foreach ($this->jsonCandidates($rawResponse) as $candidate) {
            try {
                $decoded = json_decode($candidate, true, 512, JSON_THROW_ON_ERROR);
            } catch (JsonException) {
                continue;
            }

            if (!is_array($decoded)) {
                continue;
            }

            $latex = $decoded['updated_latex_code'] ?? null;

            if (is_string($latex) && trim($latex) !== '') {
                return $latex;
            }
        }

        return null;
    }

    /**
     * OpenAI may return plain JSON, a fenced JSON block, or explanatory text
     * surrounding the JSON object. Try each safe representation in order.
     *
     * @return array<int, string>
     */
    private function jsonCandidates(string $rawResponse): array
    {
        $candidates = [$rawResponse];

        if (preg_match('/```(?:json)?\s*(\{.*\})\s*```/is', $rawResponse, $matches) === 1) {
            $candidates[] = trim($matches[1]);
        }

        $firstBrace = strpos($rawResponse, '{');
        $lastBrace = strrpos($rawResponse, '}');

        if ($firstBrace !== false && $lastBrace !== false && $lastBrace > $firstBrace) {
            $candidates[] = substr($rawResponse, $firstBrace, $lastBrace - $firstBrace + 1);
        }

        return array_values(array_unique(array_filter(
            $candidates,
            static fn (string $candidate): bool => trim($candidate) !== ''
        )));
    }
}
