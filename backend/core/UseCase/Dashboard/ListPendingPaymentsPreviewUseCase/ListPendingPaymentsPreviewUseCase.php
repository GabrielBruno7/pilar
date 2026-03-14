<?php

namespace Core\UseCase\Dashboard\ListPendingPaymentsPreviewUseCase;

use Core\Domain\User\User;
use Core\Domain\Dashboard\Dashboard;
use Core\UseCase\Dashboard\DashboardInput;
use Core\Domain\Dashboard\DashboardRepositoryInterface;

class ListPendingPaymentsPreviewUseCase
{
    public function __construct(
        private DashboardRepositoryInterface $dashboardRepository,
    ) {}

    public function execute(DashboardInput $input): ListPendingPaymentsPreviewOutput
    {
        $owner = (new User())->setId($input->ownerId);

        $dashboard = (new Dashboard())->setOwner($owner);

        $payments = $this->dashboardRepository->findPendingPaymentsPreview($dashboard);

        $items = array_map(
            fn ($payment) => new ListPendingPaymentsPreviewItemOutput(
                id: $payment->id,
                status: $payment->status,
                due_date: $payment->due_date,
                tenant_id: $payment->tenant_id,
                property_id: $payment->property_id,
                tenant_name: $payment->tenant_name,
                property_city: $payment->property_city,
                property_title: $payment->property_title,
                property_state: $payment->property_state,
                reference_month: $payment->reference_month,
                expected_amount: (float) $payment->expected_amount,
            ),
            $payments
        );

        return new ListPendingPaymentsPreviewOutput($items);
    }
}
