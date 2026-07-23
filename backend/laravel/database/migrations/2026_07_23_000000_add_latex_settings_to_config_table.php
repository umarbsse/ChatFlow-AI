<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        DB::table('config')->updateOrInsert(
            ['key' => 'LATEX_BINARY'],
            [
                'value' => (string) env(
                    'LATEX_BINARY',
                    'C:/Users/John/AppData/Local/Programs/MiKTeX/miktex/bin/x64/pdflatex.exe'
                ),
                'type' => 'string',
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );

        DB::table('config')->updateOrInsert(
            ['key' => 'LATEX_COMPILE_TIMEOUT'],
            [
                'value' => (string) env('LATEX_COMPILE_TIMEOUT', 120),
                'type' => 'integer',
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );
    }

    public function down(): void
    {
        DB::table('config')
            ->whereIn('key', ['LATEX_BINARY', 'LATEX_COMPILE_TIMEOUT'])
            ->delete();
    }
};
