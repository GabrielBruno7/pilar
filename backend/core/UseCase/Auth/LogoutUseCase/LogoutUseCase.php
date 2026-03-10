<?php

namespace Core\UseCase\Auth\LogoutUseCase;

use Core\Domain\Auth\AuthRepositoryInterface;
use Core\UseCase\Auth\LogoutUseCase\LogoutInput;

final class LogoutUseCase
{
    public function __construct(private AuthRepositoryInterface $authPersistence) {}

    public function execute(LogoutInput $input): void
    {
        $tokenHash = hash('sha256', $input->plainToken);

        $this->authPersistence->revokeByTokenHash($tokenHash);
    }
}

