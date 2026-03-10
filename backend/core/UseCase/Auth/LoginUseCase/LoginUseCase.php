<?php

namespace Core\UseCase\Auth\LoginUseCase;

use Core\Domain\Auth\Auth;
use Core\Domain\Auth\AuthRepositoryInterface;
use Core\Domain\User\User;
use Core\Domain\User\UserRepositoryInterface;
use Core\UseCase\Auth\LoginUseCase\LoginInput;
use Core\UseCase\Auth\LoginUseCase\LoginOutput;
use Illuminate\Support\Str;
use RuntimeException;

class LoginUseCase
{
    public function __construct(
        private UserRepositoryInterface $userPersistence,
        private AuthRepositoryInterface $authPersistence,
    ) {}

    public function execute(LoginInput $input): LoginOutput
    {
        $user = $this->checkCredentials($input);

        $plainToken = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $plainToken);

        $auth = (new Auth())
            ->setId((string) Str::uuid())
            ->setUser($user)
            ->setTokenHash($tokenHash)
        ;

        $this->authPersistence->createToken($auth);

        return new LoginOutput(
            id: $user->getId(),
            name: $user->getName(),
            email: $user->getEmail(),
            accessToken: $plainToken,
        );
    }

    private function checkCredentials(LoginInput $input): User
    {
        $user = $this->userPersistence->loadByEmail($input->email);

        if (!$user || !password_verify($input->password, $user->getPasswordHash())) {
            throw new RuntimeException('Credenciais inválidas.');
        }

        return $user;
    }
}