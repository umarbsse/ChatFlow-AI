<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $table = 'chat_messages';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'chat_owner',
        'ai_instance_id',
        'instance_title',
        'msg',
        'msg_type',
        'file_name',
        'file_path',
        'file_full_path',
        'chatgpt_file_id',
        'ai_raw_response',
        'chatgpt_file_upload_response',
        'added_at',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'chat_owner' => 'integer',
        'ai_instance_id' => 'integer',
        'msg_type' => 'integer',
        'chatgpt_file_upload_response' => 'integer',
        'added_at' => 'datetime',
    ];
}