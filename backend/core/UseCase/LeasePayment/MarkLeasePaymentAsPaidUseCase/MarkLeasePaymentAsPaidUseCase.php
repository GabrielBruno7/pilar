<?php

namespace Core\UseCase\LeasePayment\MarkLeasePaymentAsPaidUseCase;

use RuntimeException;
use Core\Domain\User\User;
use Core\Domain\LeasePayment\LeasePayment;
use Core\Domain\LeasePayment\LeasePaymentRepositoryInterface;

class MarkLeasePaymentAsPaidUseCase
{
    private LeasePayment $leasePayment;

    public function __construct(
        private LeasePaymentRepositoryInterface $leasePaymentRepository,
    ) {}

    public function execute(MarkLeasePaymentAsPaidInput $input): MarkLeasePaymentAsPaidOutput
    {
        $owner = (new User())->setId($input->ownerId);

        $this->leasePayment = (new LeasePayment())
            ->setOwner($owner)
            ->setId($input->leasePaymentId)
        ;

        $this->checkIfLeasePaymentExist();
        $this->checkIfLeasePaymentAlreadyPaid();

        $this->leasePayment->setStatus(LeasePayment::STATUS_PAID);
        $this->leasePayment->setPaidAt($input->paidAt ?? now()->toDateTimeString());

        $this->leasePaymentRepository->update($this->leasePayment);

        return new MarkLeasePaymentAsPaidOutput(
            id: $this->leasePayment->getId(),
        );
    }

    private function checkIfLeasePaymentExist(): LeasePayment
    {
        if (!$this->leasePaymentRepository->findByIdAndOwnerId($this->leasePayment)) {
            throw new RuntimeException('Lease payment not found.');
        }
        
        return $this->leasePayment;
    }

    private function checkIfLeasePaymentAlreadyPaid(): void
    {
        if ($this->leasePayment->getStatus() === LeasePayment::STATUS_PAID) {
            throw new RuntimeException('This payment is already marked as paid.');
        }
    }
}
