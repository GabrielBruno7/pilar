<?php

namespace Core\UseCase\Lease\CreateLeaseUseCase;

class CreateLeaseInput
{
    public function __construct(
        public string $ownerId,
        public string $propertyId,
        public string $tenantId,
        public string $startDate,
        public ?string $endDate,
        public float $rentAmount,
        public int $dueDay,
    ) {}
}
