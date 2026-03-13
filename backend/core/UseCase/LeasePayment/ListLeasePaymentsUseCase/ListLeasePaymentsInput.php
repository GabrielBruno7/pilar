<?php

namespace Core\UseCase\LeasePayment\ListLeasePaymentsUseCase;

final class ListLeasePaymentsInput
{
    public function __construct(
        public string $ownerId,
    ) {}
}
