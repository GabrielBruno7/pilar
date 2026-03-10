<?php

namespace Core\UseCase\Auth\LogoutUseCase;

class LogoutInput
{
    public function __construct(
        public string $plainToken,
    ) {}
}
