<?php

namespace Core\UseCase\Property\ListPropertiesUseCase;

class ListPropertiesItemOutput
{
    public function __construct(
        public string $id,
        public string $title,
        public ?string $city,
        public string $status,
        public ?string $state,
        public bool $hasActiveLease,
    ) {}
}
