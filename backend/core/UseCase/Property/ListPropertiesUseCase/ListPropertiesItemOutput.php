<?php

namespace Core\UseCase\Property\ListPropertiesUseCase;

final class ListPropertiesItemOutput
{
    public function __construct(
        public string $id,
        public string $title,
        public ?string $city,
        public ?string $state,
    ) {}
}
