<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('user_id');

            $table->tinyInteger('chat_owner')
                ->comment('1=user,2=ai_bot');

            $table->unsignedBigInteger('ai_instance_id');

            $table->text('instance_title')->nullable();

            $table->text('msg');

            $table->tinyInteger('msg_type')
                ->default(1)
                ->comment('1=text,2=file');

            $table->text('file_name')->nullable();
            $table->text('file_path')->nullable();
            $table->text('file_full_path')->nullable();

            $table->text('chatgpt_file_id')->nullable();

            $table->longText('ai_raw_response')->nullable();

            $table->tinyInteger('chatgpt_file_upload_response')
                ->default(0);

            $table->timestamp('added_at')->useCurrent();

            $table->index('user_id');
            $table->index('ai_instance_id');
            $table->index('chat_owner');
            $table->index('msg_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
    }
};