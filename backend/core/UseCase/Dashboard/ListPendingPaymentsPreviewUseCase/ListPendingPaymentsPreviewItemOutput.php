<?php

namespace Core\UseCase\Dashboard\ListPendingPaymentsPreviewUseCase;

class ListPendingPaymentsPreviewItemOutput
{
    public function __construct(
        public string $id,
        public string $status,
        public string $reference_month,
        public string $due_date,
        public float $expected_amount,
        public string $property_id,
        public string $property_title,
        public string $property_city,
        public string $property_state,
        public string $tenant_id,
        public string $tenant_name,
    ) {}
}
