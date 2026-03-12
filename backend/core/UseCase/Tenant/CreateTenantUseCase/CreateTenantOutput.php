<?php

namespace Core\UseCase\Tenant\CreateTenantUseCase;

final class CreateTenantOutput
{
    public function __construct(
        public string $id,
    ) {}
}
