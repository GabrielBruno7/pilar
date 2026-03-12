<?php

namespace Core\UseCase\Lease\ListLeasesUseCase;

class ListLeasesOutput
{
    public function __construct(
        public array $leases,
    ) {}
}
