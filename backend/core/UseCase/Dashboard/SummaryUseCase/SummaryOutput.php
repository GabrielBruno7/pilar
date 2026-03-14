<?php

namespace Core\UseCase\Dashboard\SummaryUseCase;

class SummaryOutput
{
    public function __construct(
        public int $activeLeases,
        public int $paidPayments,
        public int $totalProperties,
        public int $pendingPayments,
        public int $vacantProperties,
        public int $occupiedProperties,
    ) {}
}
