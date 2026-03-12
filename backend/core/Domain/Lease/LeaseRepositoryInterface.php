<?php

namespace Core\Domain\Lease;

interface LeaseRepositoryInterface
{
    public function create(Lease $lease): Lease;
    public function listByOwnerId(Lease $lease): array;
    public function hasActiveLeaseForProperty(Lease $lease): bool;
}
