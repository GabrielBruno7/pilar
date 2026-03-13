<?php

namespace Core\UseCase\Property\ShowPropertyUseCase;

use Core\Domain\Property\Property;

class ShowPropertyOutput
{
    public function __construct(
        public Property $property,
    ) {}
}
