<?php

namespace Core\Domain\Dashboard;

use Core\Domain\User\User;
use Core\Domain\Dashboard\DashboardRepositoryInterface;

class Dashboard
{
    private User $owner;
    private ?DashboardRepositoryInterface $persistence;

    public function __construct(?DashboardRepositoryInterface $persistence = null)
    {
        $this->persistence = $persistence;
    }

    public function getPersistence(): ?DashboardRepositoryInterface
    {
        return $this->persistence;
    }

    public function setOwner(User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }

    public function getOwner(): User
    {
        return $this->owner;
    }
}
