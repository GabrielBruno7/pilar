<?php

namespace Core\UseCase\Tenant\ListTenantsUseCase;

class ListTenantsOutput
{
    public function __construct(
        public array $tenants,
    ) {}
}
