<?php

namespace Core\UseCase\Lease\CreateLeaseUseCase;

use RuntimeException;
use Illuminate\Support\Str;
use Core\Domain\Lease\Lease;
use Core\Domain\Tenant\Tenant;
use Core\Domain\Property\Property;
use Core\Domain\User\UserRepositoryInterface;
use Core\Domain\Lease\LeaseRepositoryInterface;
use Core\Domain\Tenant\TenantRepositoryInterface;
use Core\Domain\Property\PropertyRepositoryInterface;

class CreateLeaseUseCase
{
    private Property $property;
    private Tenant $tenant;
    private Lease $lease;

    public function __construct(
        private UserRepositoryInterface $userRepository,
        private LeaseRepositoryInterface $leaseRepository,
        private TenantRepositoryInterface $tenantRepository,
        private PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function execute(CreateLeaseInput $input): CreateLeaseOutput
    {
        $startDate = trim($input->startDate);
        $endDate = $input->endDate ? trim($input->endDate) : null;

        $owner = $this->userRepository
            ->loadById($input->ownerId)
        ;

        $this->tenant = (new Tenant())
            ->setOwner($owner)
            ->setId($input->tenantId)
        ;

        $this->property = (new Property())
            ->setOwner($owner)
            ->setId($input->propertyId)
        ;

        $this->lease = (new Lease())
            ->setOwner($owner)
            ->setEndDate($endDate)
            ->setTenant($this->tenant)
            ->setStartDate($startDate)
            ->setDueDay($input->dueDay)
            ->setId((string) Str::uuid())
            ->setProperty($this->property)
            ->setStatus(Lease::STATUS_ACTIVE)
            ->setRentAmount($input->rentAmount)
        ;

        $this->checkIfTenantExist();
        $this->checkIfPropertyExist();
        $this->checkIfDueDayIsValid();
        $this->checkIfEndDateIsValid();
        $this->checkIfRentAmountIsValid();
        $this->checkIfPropertyAlreadyHasActiveLease();

        $this->leaseRepository->create($this->lease);

        return new CreateLeaseOutput(
            id: $this->lease->getId(),
        );
    }

    private function checkIfPropertyExist(): Property
    {
        if (!$this->propertyRepository->loadById($this->property)) {
            throw new \RuntimeException('Property not found.');
        }

        return $this->property;
    }

    private function checkIfTenantExist(): Tenant
    {
        if (!$this->tenantRepository->loadTenantById($this->tenant)) {
            throw new \RuntimeException('Tenant not found.');
        }

        return $this->tenant;
    }

    private function checkIfPropertyAlreadyHasActiveLease(): void
    {
        if ($this->leaseRepository->hasActiveLeaseForProperty($this->lease)) {
            throw new RuntimeException('This property already has an active lease.');
        }
    }

    private function checkIfEndDateIsValid(): void
    {
        if ($this->lease->getEndDate() !== null && $this->lease->getEndDate() < $this->lease->getStartDate()) {
            throw new RuntimeException('End date cannot be earlier than start date.');
        }
    }

    private function checkIfRentAmountIsValid(): void
    {
        if ($this->lease->getRentAmount() <= 0) {
            throw new RuntimeException('Rent amount must be greater than zero.');
        }
    }

    private function checkIfDueDayIsValid(): void
    {
        if ($this->lease->getDueDay() < 1 || $this->lease->getDueDay() > 31) {
            throw new RuntimeException('Due day must be between 1 and 31.');
        }
    }
}
