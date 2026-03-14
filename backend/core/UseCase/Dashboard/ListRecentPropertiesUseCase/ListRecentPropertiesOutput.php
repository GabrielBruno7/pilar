<?php

namespace Core\UseCase\Dashboard\ListRecentPropertiesUseCase;

class ListRecentPropertiesOutput
{
    public function __construct(
        public array $properties,
    ) {}
}
