<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Config extends Model
{
    protected $table = 'config';

    protected $fillable = [
        'key',
        'value',
        'type',
    ];

    public static function value(string $key, mixed $default = null): mixed
    {
        $config = static::query()
            ->where('key', $key)
            ->first();

        if (!$config) {
            return $default;
        }

        return match ($config->type) {
            'integer' => (int) $config->value,
            'float' => (float) $config->value,
            'boolean' => filter_var(
                $config->value,
                FILTER_VALIDATE_BOOLEAN
            ),
            default => $config->value,
        };
    }
}