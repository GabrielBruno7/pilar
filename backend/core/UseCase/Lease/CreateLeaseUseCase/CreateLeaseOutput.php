<?php

namespace Core\UseCase\Lease\CreateLeaseUseCase;

final class CreateLeaseOutput
{
    public function __construct(
        public string $id,
    ) {}
}
