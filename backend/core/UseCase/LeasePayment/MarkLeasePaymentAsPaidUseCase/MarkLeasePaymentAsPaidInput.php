<?php

namespace Core\UseCase\LeasePayment\MarkLeasePaymentAsPaidUseCase;

class MarkLeasePaymentAsPaidInput
{
    public function __construct(
        public string $ownerId,
        public ?string $paidAt = null,
        public string $leasePaymentId,
    ) {}
}
