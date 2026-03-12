<?php

namespace Core\UseCase\Lease\ListLeasesUseCase;

class ListLeasesInput
{
    public function __construct(
        public string $ownerId,
    ) {}
}
