<?php

namespace Core\UseCase\Property\ListPropertiesUseCase;

final class ListPropertiesOutput
{
    public function __construct(
        public array $properties,
    ) {}
}
