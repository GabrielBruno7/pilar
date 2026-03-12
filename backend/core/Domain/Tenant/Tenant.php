<?php

namespace Core\Domain\Tenant;

use Core\Domain\User\User;

class Tenant
{
    private string $id;
    private User $owner;
    private string $name;
    private ?string $email = null;
    private ?string $phone = null;
    private ?string $document = null;
    private ?TenantRepositoryInterface $persistence;

    public function __construct(?TenantRepositoryInterface $persistence = null)
    {
        $this->persistence = $persistence;
    }

    public function getPersistence(): ?TenantRepositoryInterface
    {
        return $this->persistence;
    }

    public function setId(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setOwner(User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }

    public function getOwner(): User
    {
        return $this->owner;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setDocument(?string $document): self
    {
        $this->document = $document;

        return $this;
    }

    public function getDocument(): ?string
    {
        return $this->document;
    }
}
