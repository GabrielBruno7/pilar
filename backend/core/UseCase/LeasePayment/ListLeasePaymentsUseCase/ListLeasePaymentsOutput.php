<?php

namespace Core\UseCase\LeasePayment\ListLeasePaymentsUseCase;

class ListLeasePaymentsOutput
{
    public function __construct(
        public array $payments,
    ) {}
}
