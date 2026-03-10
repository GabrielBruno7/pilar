<?php

namespace Core\Domain\Auth;

use Core\Domain\User\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use RuntimeException;

class Auth
{
    private string $id;
    private User $user;
    private string $tokenHash;
    private ?string $expiresAt = null;
    private ?AuthRepositoryInterface $persistence;

    public function __construct(?AuthRepositoryInterface $authRepository = null)
    {
        $this->persistence = $authRepository;
    }

    public function setId(string $id): Auth
    {
        $this->id = $id;

        return $this;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setExpiresAt(string $expiresAt): Auth
    {
        $this->expiresAt = $expiresAt;

        return $this;
    }

    public function getExpiresAt(): ?string
    {
        return $this->expiresAt;
    }

    public function setTokenHash(string $tokenHash): Auth
    {
        $this->tokenHash = $tokenHash;

        return $this;
    }

    public function getTokenHash(): string
    {
        return $this->tokenHash;
    }

    public function setUser(User $user): Auth
    {
        $this->user = $user;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }


    public function login(string $email, string $password): array
    {
        $user = $this->persistence->findByEmail($email);

        if (! $user || ! Hash::check($password, $user->passwordHash())) {
            throw new RuntimeException('Credenciais inválidas.');
        }

        $plainToken = Str::random(80);
        $tokenHash = hash('sha256', $plainToken);

        $this->persistence->createToken($user->id(), $tokenHash);

        return [
            'user' => $user,
            'access_token' => $plainToken,
            'token_type' => 'Bearer',
        ];
    }

    public function me(int $userId): User
    {
        $user = $this->users->findById($userId);

        if (! $user) {
            throw new RuntimeException('Usuário não encontrado.');
        }

        return $user;
    }

    public function logout(string $plainToken): void
    {
        $tokenHash = hash('sha256', $plainToken);
        $this->authRepository->revokeByTokenHash($tokenHash);
    }
}
