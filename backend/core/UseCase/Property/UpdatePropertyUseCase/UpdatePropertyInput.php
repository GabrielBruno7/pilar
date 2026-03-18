<?php

namespace Core\UseCase\Property\UpdatePropertyUseCase;

class UpdatePropertyInput
{
    public function __construct(
        public string $userId,
        public string $propertyId,
        public ?string $city = null,
        public ?string $area = null,
        public ?int $parking = null,
        public ?int $bedrooms = null,
        public ?string $state = null,
        public ?string $title = null,
        public ?string $street = null,
        public ?string $number = null,
        public ?string $postalCode = null,
        public ?string $description = null,
        public ?string $neighborhood = null,
    ) {}
}
