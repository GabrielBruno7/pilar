<?php

namespace Core\UseCase\LeasePayment\MarkLeasePaymentAsPaidUseCase;

class MarkLeasePaymentAsPaidOutput
{
    public function __construct(
        public string $id,
    ) {}
}
