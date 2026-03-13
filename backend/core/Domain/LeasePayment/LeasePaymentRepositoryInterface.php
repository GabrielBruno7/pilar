<?php

namespace Core\Domain\LeasePayment;

interface LeasePaymentRepositoryInterface
{
    public function update(LeasePayment $leasePayment): void;
    public function create(LeasePayment $leasePayment): LeasePayment;
    public function listByOwnerId(LeasePayment $leasePayment): array;
    public function findByIdAndOwnerId(LeasePayment $leasePayment): bool;
    public function existsByLeaseIdAndReferenceMonth(LeasePayment $leasePayment): bool;
}
