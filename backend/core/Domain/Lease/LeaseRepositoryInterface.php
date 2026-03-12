<?php

namespace Core\Domain\Lease;

interface LeaseRepositoryInterface
{
    public function create(Lease $lease): Lease;
    public function loadById(Lease $lease): bool;
    public function listByOwnerId(Lease $lease): array;
    public function updateToEndedStatus(Lease $lease): void;
    public function hasActiveLeaseForProperty(Lease $lease): bool;
}
