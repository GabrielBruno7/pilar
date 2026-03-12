<?php

namespace Core\UseCase\Tenant\ListTenantsUseCase;

use Core\Domain\Tenant\TenantRepositoryInterface;

class ListTenantsUseCase
{
    public function __construct(private TenantRepositoryInterface $tenantRepository) {}

    public function execute(ListTenantsInput $input): ListTenantsOutput
    {
        $tenants = $this->tenantRepository->findTenantsByOwnerId($input->ownerId);

        $tenantItems = array_map(fn($tenant) => new ListTenantsItemOutput(
            id: $tenant->getId(),
            name: $tenant->getName(),
            document: $tenant->getDocument(),
            email: $tenant->getEmail(),
            phone: $tenant->getPhone()
        ), $tenants);

        return new ListTenantsOutput($tenantItems);
    }
}
