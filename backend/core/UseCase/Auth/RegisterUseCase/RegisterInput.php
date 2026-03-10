<?php

namespace Core\UseCase\Auth\RegisterUseCase;

class RegisterInput
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {}
}