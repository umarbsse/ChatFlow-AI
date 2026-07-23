<?php

namespace App\Services\Vacancy;

use JsonException;

class VacancyAIResponseParser
{
    /**
     * Parse the structured vacancy response returned by OpenAI.
     *
     * @return array{
     *     updated_latex_code: ?string,
     *     company_name: ?string,
     *     position_name: ?string
     * }
     */
    public function extractVacancyData(?string $rawResponse): array
    {
        $empty = [
            'updated_latex_code' => null,
            'company_name' => null,
            'position_name' => null,
        ];

        $rawResponse = trim((string) $rawResponse);

        if ($rawResponse === '') {
            return $empty;
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

            return [
                'updated_latex_code' => $this->nonEmptyString(
                    $decoded['updated_latex_code'] ?? null
                ),
                'company_name' => $this->nonEmptyString(
                    $decoded['company_name'] ?? null
                ),
                // Support both the requested field name and the key used by the
                // current OpenAI response format.
                'position_name' => $this->nonEmptyString(
                    $decoded['position_name'] ?? $decoded['job_applied_for'] ?? null
                ),
            ];
        }

        return $empty;
    }

    /**
     * Extract only the updated LaTeX document from the OpenAI JSON response.
     */
    public function extractUpdatedLatexCode(?string $rawResponse): ?string
    {
        return $this->extractVacancyData($rawResponse)['updated_latex_code'];
    }

    private function nonEmptyString(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }

        $value = trim($value);

        return $value !== '' ? $value : null;
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
