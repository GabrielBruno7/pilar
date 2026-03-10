<?php

namespace Core\UseCase\Auth\LoginUseCase;

class LoginInput
{
    public function __construct(
        public string $email,
        public string $password,
    ) {}
}
