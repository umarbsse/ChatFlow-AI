<?php

namespace App\Providers;

use App\Events\VacancyCreated;
use App\Listeners\LogVacancyCreated;
use App\Listeners\ProcessVacancyCompiledPrompt;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Schema::defaultStringLength(191);

        Event::listen(VacancyCreated::class, LogVacancyCreated::class);
        Event::listen(VacancyCreated::class, ProcessVacancyCompiledPrompt::class);
    }
}