<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Authorization policies
        Gate::define('create', fn($user) => $user->isAdmin());
        Gate::define('update', fn($user, $job) => $user->isAdmin());
        Gate::define('delete', fn($user, $job) => $user->isAdmin());
        Gate::define('viewAnalytics', fn($user) => $user->isAdmin());
    }
}
