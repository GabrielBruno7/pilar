<?php

namespace Core\Domain\Auth;

interface AuthRepositoryInterface
{
    public function createToken(Auth $auth): void;

    public function findUserIdByTokenHash(string $tokenHash): ?string;

    public function revokeByTokenHash(string $tokenHash): void;
}