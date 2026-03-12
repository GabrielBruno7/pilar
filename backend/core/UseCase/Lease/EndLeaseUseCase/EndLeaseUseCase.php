<?php

namespace Core\UseCase\Lease\EndLeaseUseCase;

use Core\Domain\Lease\Lease;
use Core\Domain\Lease\LeaseRepositoryInterface;
use RuntimeException;

class EndLeaseUseCase
{
    public function __construct(
        private LeaseRepositoryInterface $leaseRepository,
    ) {}

    public function execute(EndLeaseInput $input): void
    {
        $lease = (new Lease())->setId($input->id);
        $lease = $this->checkIfLeaseExists($lease);

        $this->checkIfLeaseCanBeEnded($lease);

        $lease->setStatus(Lease::STATUS_ENDED);
        $lease->setEndDate(date('Y-m-d'));

        $this->leaseRepository->updateToEndedStatus($lease);
    }

    private function checkIfLeaseCanBeEnded(Lease $lease): void
    {
        if ($lease->getStatus() === Lease::STATUS_ENDED) {
            throw new RuntimeException('Lease is already ended');
        }
    }

    private function checkIfLeaseExists(Lease $lease): Lease
    {
        if (!$this->leaseRepository->loadById($lease)) {
            throw new RuntimeException('Lease not found');
        }

        return $lease;
    }
}
