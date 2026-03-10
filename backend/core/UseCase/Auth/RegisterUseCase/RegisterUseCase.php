<?php

namespace Core\UseCase\Auth\RegisterUseCase;

use Core\Domain\User\User;
use Core\Domain\User\UserRepositoryInterface;
use Core\UseCase\Auth\RegisterUseCase\RegisterInput;
use Core\UseCase\Auth\RegisterUseCase\RegisterOutput;
use Illuminate\Support\Str;
use RuntimeException;

class RegisterUseCase
{
    public function __construct(private UserRepositoryInterface $userPersistence) {}

    public function execute(RegisterInput $input): RegisterOutput
    {
        $this->checkIfUserAlreadyExists($input->email);

        $user = (new User())
            ->setId((string) Str::uuid())
            ->setName($input->name)
            ->setEmail($input->email)
            ->setPassword($input->password)
        ;

        $this->hashPassword($user);

        $user = $this->userPersistence->create($user);

        return new RegisterOutput(
            id: $user->getId()
        );
    }

    private function hashPassword(User $user): void
    {
        $user->setPasswordHash(
            password_hash($user->getPassword(),
            PASSWORD_BCRYPT
        ));
    }

    private function checkIfUserAlreadyExists(string $email): void
    {
        $existingUser = $this->userPersistence->loadByEmail($email);

        if ($existingUser) {
            throw new RuntimeException('E-mail já cadastrado.');
        }
    }
}
