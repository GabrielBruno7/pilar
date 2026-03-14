<?php

namespace Core\UseCase\Dashboard\ListPendingPaymentsPreviewUseCase;

class ListPendingPaymentsPreviewOutput
{
    public function __construct(
        public array $pendingPayments,
    ) {}
}
