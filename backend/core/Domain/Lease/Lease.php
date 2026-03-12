<?php

namespace Core\Domain\Lease;

use Core\Domain\Property\Property;
use Core\Domain\Tenant\Tenant;
use Core\Domain\User\User;

class Lease
{
    private string $id;
    private int $dueDay;
    private User $owner;
    private string $status;
    private Tenant $tenant;
    private string $startDate;
    private float $rentAmount;
    private Property $property;
    private ?string $endDate = null;
    private ?LeaseRepositoryInterface $persistence;

    public const STATUS_DELETED = 'deleted';
    public const STATUS_ACTIVE = 'active';

    public function __construct(?LeaseRepositoryInterface $persistence = null)
    {
        $this->persistence = $persistence;
    }

    public function getPersistence(): ?LeaseRepositoryInterface
    {
        return $this->persistence;
    }

    public function setId(?string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getId(): ?string
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

    public function setProperty(Property $property): self
    {
        $this->property = $property;

        return $this;
    }

    public function getProperty(): Property
    {
        return $this->property;
    }

    public function setTenant(Tenant $tenant): self
    {
        $this->tenant = $tenant;

        return $this;
    }

    public function getTenant(): Tenant
    {
        return $this->tenant;
    }

    public function setStartDate(string $startDate): self
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getStartDate(): string
    {
        return $this->startDate;
    }

    public function setEndDate(?string $endDate): self
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function getEndDate(): ?string
    {
        return $this->endDate;
    }

    public function setRentAmount(float $rentAmount): self
    {
        $this->rentAmount = $rentAmount;

        return $this;
    }

    public function getRentAmount(): float
    {
        return $this->rentAmount;
    }

    public function setDueDay(int $dueDay): self
    {
        $this->dueDay = $dueDay;

        return $this;
    }

    public function getDueDay(): int
    {
        return $this->dueDay;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }
}
