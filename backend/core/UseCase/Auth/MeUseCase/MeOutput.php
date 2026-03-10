<?php

namespace Core\UseCase\Auth\MeUseCase;

final class MeOutput
{
    public function __construct(
        public string $id,
        public string $name,
        public string $email,
    ) {}
}