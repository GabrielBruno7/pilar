<?php

namespace Core\UseCase\Property\CreatePropertyUseCase;

class CreatePropertyInput
{
    public function __construct(
        public string $title,
        public string $userId,
        public ?string $city = null,
        public ?string $state = null,
        public ?string $street = null,
        public ?string $number = null,
        public ?string $postalCode = null,
        public ?string $description = null,
        public ?string $neighborhood = null,
    ) {}
}
