<?php

namespace Core\UseCase\Dashboard;

class DashboardInput
{
    public function __construct(
        public string $ownerId,
    ) {}
}
