<?php

namespace Core\Domain\Property;

use Core\Domain\User\User;
use Core\Domain\Lease\Lease;

class Property
{
    private User $owner;
    private string $title;
    private string $status;
    private ?string $id = null;
    private ?int $parking = null;
    private ?string $area = null;
    private ?Lease $lease = null;
    private ?string $city = null;
    private ?int $bedrooms = null;
    private ?string $state = null;
    private ?string $street = null;
    private ?string $number = null;
    private ?string $postalCode = null;
    private ?string $description = null;
    private ?string $neighborhood = null;
    private bool $hasActiveLease = false;
    private ?PropertyRepositoryInterface $persistence;

    public const STATUS_DELETED = 'deleted';
    public const STATUS_ACTIVE = 'active';

    public function __construct(?PropertyRepositoryInterface $persistence = null)
    {
        $this->persistence = $persistence;
    }

    public function getPersistence(): ?PropertyRepositoryInterface
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

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setLease(?Lease $lease): self
    {
        $this->lease = $lease;

        return $this;
    }

    public function getLease(): ?Lease
    {
        return $this->lease;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setPostalCode(?string $postalCode): self
    {
        $this->postalCode = $postalCode;

        return $this;
    }

    public function getPostalCode(): ?string
    {
        return $this->postalCode;
    }

    public function setStreet(?string $street): self
    {
        $this->street = $street;

        return $this;
    }

    public function getStreet(): ?string
    {
        return $this->street;
    }

    public function setNumber(?string $number): self
    {
        $this->number = $number;

        return $this;
    }

    public function getNumber(): ?string
    {
        return $this->number;
    }

    public function setNeighborhood(?string $neighborhood): self
    {
        $this->neighborhood = $neighborhood;

        return $this;
    }

    public function getNeighborhood(): ?string
    {
        return $this->neighborhood;
    }

    public function setCity(?string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setState(?string $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setArea(?string $area): self
    {
        $this->area = $area;

        return $this;
    }

    public function getArea(): ?string
    {
        return $this->area;
    }

    public function setBedrooms(?int $bedrooms): self
    {
        $this->bedrooms = $bedrooms;

        return $this;
    }

    public function getBedrooms(): ?int
    {
        return $this->bedrooms;
    }

    public function setParking(?int $parking): self
    {
        $this->parking = $parking;

        return $this;
    }

    public function getParking(): ?int
    {
        return $this->parking;
    }

    public function setHasActiveLease(bool $hasActiveLease): self
    {
        $this->hasActiveLease = $hasActiveLease;

        return $this;
    }

    public function getHasActiveLease(): bool
    {
        return $this->hasActiveLease;
    }
}
