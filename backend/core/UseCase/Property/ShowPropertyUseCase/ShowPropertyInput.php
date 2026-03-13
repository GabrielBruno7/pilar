<?php

namespace Core\UseCase\Property\ShowPropertyUseCase;

class ShowPropertyInput
{
    public function __construct(
        public string $ownerId,
        public string $propertyId,
    ) {}
}
