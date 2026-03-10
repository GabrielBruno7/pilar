<?php

namespace Core\UseCase\Auth\RegisterUseCase;

final class RegisterOutput
{
    public function __construct(
        public string $id,
    ) {}
}