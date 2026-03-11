<?php

namespace Core\UseCase\Property\CreatePropertyUseCase;

final class CreatePropertyOutput
{
    public function __construct(
        public string $id,
    ) {}
}
