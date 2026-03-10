<?php

namespace Core\Domain\User;

interface UserRepositoryInterface
{
    public function loadByEmail(string $email): ?User;
    public function loadById(string $id): ?User;
    public function create(User $user): User;
}
