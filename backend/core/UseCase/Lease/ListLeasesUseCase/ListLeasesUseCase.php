<?php

namespace Core\UseCase\Lease\ListLeasesUseCase;

use Core\Domain\User\User;
use Core\Domain\Lease\Lease;
use Core\Domain\Lease\LeaseRepositoryInterface;


class ListLeasesUseCase
{
    public function __construct(
        private LeaseRepositoryInterface $leaseRepository,
    ) {}

    public function execute(ListLeasesInput $input): ListLeasesOutput
    {
        $owner = (new User())->setId($input->ownerId);
        $lease = (new Lease())->setOwner($owner);

        $leases = $this->leaseRepository->listByOwnerId($lease);

        $leases = array_map(fn($lease) => new ListLeasesItemOutput(
            id: $lease->getId(),
            dueDay: $lease->getDueDay(),
            status: $lease->getStatus(),
            endDate: $lease->getEndDate(),
            startDate: $lease->getStartDate(),
            rentAmount: $lease->getRentAmount(),
            tenantId: $lease->getTenant()->getId(),
            tenantName: $lease->getTenant()->getName(),
            propertyId: $lease->getProperty()->getId(),
            propertyTitle: $lease->getProperty()->getTitle(),
        ), $leases);

        return new ListLeasesOutput(
            leases: $leases,
        );
    }
}
