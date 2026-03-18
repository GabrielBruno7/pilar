<?php

namespace Core\UseCase\Property\CreatePropertyUseCase;

class CreatePropertyInput
{
    public function __construct(
        public string $title,
        public string $ownerId,
        public ?int $parking = null,
        public ?string $area = null,
        public ?string $city = null,
        public ?int $bedrooms = null,
        public ?string $state = null,
        public ?string $street = null,
        public ?string $number = null,
        public ?string $postalCode = null,
        public ?string $description = null,
        public ?string $neighborhood = null,
    ) {}
}
