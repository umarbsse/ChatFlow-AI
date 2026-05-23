<?php

namespace App\Listeners;

use App\Events\UserRegistered;
use App\Notifications\WelcomeUserNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendWelcomeEmail implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(UserRegistered $event): void
    {
        $event->user->notify(new WelcomeUserNotification());
    }
}