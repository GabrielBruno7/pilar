<?php

namespace Core\UseCase\Property\UpdatePropertyUseCase;

final class UpdatePropertyInput
{
    public function __construct(
        public string $propertyId,
        public string $userId,
        public ?string $title = null,
        public ?string $description = null,
        public ?string $postalCode = null,
        public ?string $street = null,
        public ?string $number = null,
        public ?string $neighborhood = null,
        public ?string $city = null,
        public ?string $state = null,
    ) {}
}
