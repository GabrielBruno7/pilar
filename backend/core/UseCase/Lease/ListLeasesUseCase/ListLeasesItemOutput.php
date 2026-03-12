<?php

namespace Core\UseCase\Lease\ListLeasesUseCase;

final class ListLeasesItemOutput
{
    public function __construct(
        public string $id,
        public string $propertyId,
        public string $tenantId,
        public string $startDate,
        public ?string $endDate,
        public string $rentAmount,
        public int $dueDay,
        public string $status,
    ) {}
}
