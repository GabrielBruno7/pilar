<?php

namespace Core\UseCase\Lease\EndLeaseUseCase;

class EndLeaseInput
{
    public function __construct(
        public string $id,
    ) {}
}
