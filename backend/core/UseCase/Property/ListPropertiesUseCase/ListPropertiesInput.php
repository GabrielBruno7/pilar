<?php

namespace Core\UseCase\Property\ListPropertiesUseCase;

class ListPropertiesInput
{
    public function __construct(
        public string $userId,
    ) {}
}
