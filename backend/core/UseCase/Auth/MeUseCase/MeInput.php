<?php

namespace Core\UseCase\Auth\MeUseCase;

class MeInput
{
    public function __construct(
        public string $id,
    ) {}
}