<?php

namespace Core\UseCase\Tenant\ListTenantsUseCase;

class ListTenantsInput
{
    public function __construct(
        public string $ownerId,
    ) {}
}
