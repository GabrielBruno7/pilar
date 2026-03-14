<?php

namespace Core\UseCase\Dashboard\ListRecentPropertiesUseCase;

class ListRecentPropertiesItemOutput
{
    public function __construct(
        public string $id,
        public string $title,
        public ?string $city,
        public string $status,
        public ?string $state,
    ) {}
}
