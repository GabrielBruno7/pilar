<?php

namespace Core\Domain\User;

class User
{
    private ?string $id;
    private string $name;
    private string $email;
    private string $password;
    private string $passwordHash;
    private ?UserRepositoryInterface $persistence;

    public function __construct(?UserRepositoryInterface $persistence = null)
    {
        $this->persistence = $persistence;
    }

    public function getPersistence(): ?UserRepositoryInterface
    {
        return $this->persistence;
    }

    public function setId(?string $id): User
    {
        $this->id = $id;

        return $this;
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setName(string $name): User
    {
        $this->name = $name;

        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setEmail(string $email): User
    {
        $this->email = $email;

        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setPasswordHash(string $passwordHash): User
    {
        $this->passwordHash = $passwordHash;

        return $this;
    }

    public function getPasswordHash(): string
    {
        return $this->passwordHash;
    }

    public function setPassword(string $password): User
    {
        $this->password = $password;

        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }
}
