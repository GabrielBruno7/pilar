<?php

namespace Core\UseCase\Tenant\ListTenantsUseCase;

class ListTenantsItemOutput
{
    public function __construct(
        public string $id,
        public string $name,
        public ?string $email,
        public ?string $phone,
        public ?string $document,
    ) {}
}
