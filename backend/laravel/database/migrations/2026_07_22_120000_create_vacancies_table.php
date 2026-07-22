<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->index();
            $table->string('position_name')->index();
            $table->longText('job_description')->nullable();
            $table->text('job_url')->nullable();
            $table->string('location')->nullable();
            $table->string('employment_type')->nullable();

            $table->longText('resume_old_latex_code')->nullable();
            $table->longText('ai_prompt')->nullable();
            $table->longText('resume_updated_latex_code')->nullable();
            $table->text('resume_pdf_file_path')->nullable();
            $table->string('resume_pdf_file_name')->nullable();

            $table->unsignedBigInteger('ai_instance_id')->nullable()->index();
            $table->date('apply_date')->nullable()->index();
            $table->string('status')->default('draft')->index();
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vacancies');
    }
};
