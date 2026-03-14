<?php

namespace Core\Domain\Dashboard;

interface DashboardRepositoryInterface
{
    public function countProperties(Dashboard $dashboard): int;
    public function countActiveLeases(Dashboard $dashboard): int;
    public function countPaidPayments(Dashboard $dashboard): int;
    public function countPendingPayments(Dashboard $dashboard): int;
    public function countVacantProperties(Dashboard $dashboard): int;
    public function countOccupiedProperties(Dashboard $dashboard): int;
    public function findPendingPaymentsPreview(Dashboard $dashboard): array;
}
