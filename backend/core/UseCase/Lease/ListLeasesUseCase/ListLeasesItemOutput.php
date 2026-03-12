<?php

namespace Core\UseCase\Lease\ListLeasesUseCase;

class ListLeasesItemOutput
{
    public function __construct(
        public string $id,
        public string $propertyId,
        public string $tenantId,
        public string $propertyTitle,
        public string $tenantName,
        public string $startDate,
        public ?string $endDate,
        public string $rentAmount,
        public int $dueDay,
        public string $status,
    ) {}
}
