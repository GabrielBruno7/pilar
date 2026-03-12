<?php

namespace Core\UseCase\Tenant\CreateTenantUseCase;

final class CreateTenantInput
{
    public function __construct(
        public string $ownerId,
        public string $name,
        public ?string $email = null,
        public ?string $phone = null,
        public ?string $document = null,
    ) {}
}
