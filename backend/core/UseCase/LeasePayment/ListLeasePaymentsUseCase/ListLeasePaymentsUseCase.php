<?php

namespace Core\UseCase\LeasePayment\ListLeasePaymentsUseCase;

use Core\Domain\LeasePayment\LeasePayment;
use Core\Domain\LeasePayment\LeasePaymentRepositoryInterface;
use Core\Domain\User\User;

class ListLeasePaymentsUseCase
{
    public function __construct(
        private LeasePaymentRepositoryInterface $leasePaymentRepository,
    ) {}

    public function execute(ListLeasePaymentsInput $input): ListLeasePaymentsOutput
    {
        $owner = (new User())->setId($input->ownerId);
        $leasePayment = (new LeasePayment())->setOwner($owner);

        $leasePayments = $this->leasePaymentRepository->listByOwnerId($leasePayment);

        $payments = array_map(
            fn (LeasePayment $leasePayment) => new ListLeasePaymentsItemOutput(
                id: $leasePayment->getId(),
                paidAt: $leasePayment->getPaidAt(),
                status: $leasePayment->getStatus(),
                dueDate: $leasePayment->getDueDate(),
                leaseId: $leasePayment->getLease()->getId(),
                referenceMonth: $leasePayment->getReferenceMonth(),
                expectedAmount: $leasePayment->getExpectedAmount(),
                tenantName: $leasePayment->getLease()->getTenant()->getName(),
                propertyTitle: $leasePayment->getLease()->getProperty()->getTitle(),
            ),
            $leasePayments
        );

        return new ListLeasePaymentsOutput(
            payments: $payments,
        );
    }
}
