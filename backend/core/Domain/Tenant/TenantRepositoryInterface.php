<?php

namespace Core\Domain\Tenant;

interface TenantRepositoryInterface
{
    public function create(Tenant $tenant): Tenant;
    public function loadTenantById(Tenant $tenant): bool;
    public function findTenantByDocument(Tenant $tenant): bool;
    public function findTenantsByOwnerId(string $ownerId): array;
}
