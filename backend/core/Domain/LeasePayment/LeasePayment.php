<?php

namespace Core\Domain\LeasePayment;

use Core\Domain\Lease\Lease;
use Core\Domain\User\User;

class LeasePayment
{
    private string $id;
    private User $owner;
    private Lease $lease;
    private string $status;
    private string $dueDate;
    private float $expectedAmount;
    private ?string $paidAt = null;
    private string $referenceMonth;
    private ?LeasePaymentRepositoryInterface $persistence;

    public const STATUS_PAID = 'paid';
    public const STATUS_PENDING = 'pending';
    public const STATUS_OVERDUE = 'overdue';

    public function __construct(?LeasePaymentRepositoryInterface $persistence = null)
    {
        $this->persistence = $persistence;
    }

    public function getPersistence(): ?LeasePaymentRepositoryInterface
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

    public function setLease(Lease $lease): self
    {
        $this->lease = $lease;

        return $this;
    }

    public function getLease(): Lease
    {
        return $this->lease;
    }

    public function setReferenceMonth(string $referenceMonth): self
    {
        $this->referenceMonth = $referenceMonth;

        return $this;
    }

    public function getReferenceMonth(): string
    {
        return $this->referenceMonth;
    }

    public function setDueDate(string $dueDate): self
    {
        $this->dueDate = $dueDate;

        return $this;
    }

    public function getDueDate(): string
    {
        return $this->dueDate;
    }

    public function setExpectedAmount(float $expectedAmount): self
    {
        $this->expectedAmount = $expectedAmount;

        return $this;
    }

    public function getExpectedAmount(): float
    {
        return $this->expectedAmount;
    }

    public function setPaidAt(?string $paidAt): self
    {
        $this->paidAt = $paidAt;

        return $this;
    }

    public function getPaidAt(): ?string
    {
        return $this->paidAt;
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
