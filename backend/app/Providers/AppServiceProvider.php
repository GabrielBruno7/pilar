<?php

namespace App\Providers;

use App\Infrastructure\Auth\AuthRepository;
use App\Infrastructure\User\UserRepository;
use Core\Domain\Auth\AuthRepositoryInterface;
use Core\Domain\User\UserRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    }

    public function boot(): void
    {
        //
    }
}
