<?php

namespace App\Events;

use App\Models\Vacancy;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VacancyCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Vacancy $vacancy,
        public int $userId
    ) {
        //
    }
}
