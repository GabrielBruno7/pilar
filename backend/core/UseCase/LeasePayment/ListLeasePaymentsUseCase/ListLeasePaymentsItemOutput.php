<?php

namespace Core\UseCase\LeasePayment\ListLeasePaymentsUseCase;

class ListLeasePaymentsItemOutput
{
    public function __construct(
        public string $id,
        public string $status,
        public string $leaseId,
        public string $dueDate,
        public ?string $paidAt,
        public string $tenantName,
        public string $propertyTitle,
        public string $referenceMonth,
        public string $expectedAmount,
    ) {}
}
