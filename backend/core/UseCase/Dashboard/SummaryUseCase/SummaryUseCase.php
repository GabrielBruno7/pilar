<?php

namespace Core\UseCase\Dashboard\SummaryUseCase;

use Core\Domain\User\User;
use Core\Domain\Dashboard\Dashboard;
use Core\UseCase\Dashboard\DashboardInput;
use Core\Domain\Dashboard\DashboardRepositoryInterface;
use Core\UseCase\Dashboard\SummaryUseCase\SummaryOutput;

class SummaryUseCase
{
    public function __construct(
        private DashboardRepositoryInterface $dashboardRepository,
    ) {}

    public function execute(DashboardInput $input): SummaryOutput
    {
        $owner = (new User())->setId($input->ownerId);

        $dashboard = (new Dashboard())->setOwner($owner);

        return new SummaryOutput(
            activeLeases: $this->dashboardRepository->countActiveLeases($dashboard),
            paidPayments: $this->dashboardRepository->countPaidPayments($dashboard),
            totalProperties: $this->dashboardRepository->countProperties($dashboard),
            pendingPayments: $this->dashboardRepository->countPendingPayments($dashboard),
            vacantProperties: $this->dashboardRepository->countVacantProperties($dashboard),
            occupiedProperties: $this->dashboardRepository->countOccupiedProperties($dashboard),
        );
    }
}
