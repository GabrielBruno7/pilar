<?php

namespace Core\UseCase\Auth\LoginUseCase;

final class LoginOutput
{
    public function __construct(
        public string $id,
        public string $name,
        public string $email,
        public string $accessToken,
    ) {}
}