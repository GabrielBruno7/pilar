<?php

namespace Core\UseCase\Auth\MeUseCase;

use Core\Domain\User\User;
use Core\Domain\User\UserRepositoryInterface;
use Core\UseCase\Auth\MeUseCase\MeInput;
use Core\UseCase\Auth\MeUseCase\MeOutput;
use RuntimeException;

final class MeUseCase
{
    public function __construct(private UserRepositoryInterface $userPersistence) {}

    public function execute(MeInput $input): MeOutput
    {
        $user = $this->checkIfUserExists($input->id);

        return new MeOutput(
            id: $user->getId(),
            name: $user->getName(),
            email: $user->getEmail(),
        );
    }

    private function checkIfUserExists(string $userId): User
    {
        $user = $this->userPersistence->loadById($userId);

        if (!$user) {
            throw new RuntimeException('Usuário não encontrado.');
        }

        return $user;
    }
}
