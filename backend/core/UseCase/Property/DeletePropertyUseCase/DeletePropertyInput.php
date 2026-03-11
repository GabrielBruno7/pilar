<?php

namespace Core\UseCase\Property\DeletePropertyUseCase;

class DeletePropertyInput
{
    public function __construct(
        public string $propertyId,
        public string $ownerId,
    ) {}
}
