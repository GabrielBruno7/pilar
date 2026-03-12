<?php

namespace App\Infrastructure\Lease;

use Core\Domain\Lease\Lease;
use Core\Domain\Tenant\Tenant;
use Illuminate\Support\Facades\DB;
use Core\Domain\Property\Property;
use Core\Domain\Lease\LeaseRepositoryInterface;

class LeaseRepository implements LeaseRepositoryInterface
{
    public function create(Lease $lease): Lease
    {
        DB::table('leases')->insert([
            'created_at' => now(),
            'id' => $lease->getId(),
            'status' => $lease->getStatus(),
            'due_day' => $lease->getDueDay(),
            'end_date' => $lease->getEndDate(),
            'start_date' => $lease->getStartDate(),
            'owner_id' => $lease->getOwner()->getId(),
            'rent_amount' => $lease->getRentAmount(),
            'tenant_id' => $lease->getTenant()->getId(),
            'property_id' => $lease->getProperty()->getId(),
        ]);

        return $lease;
    }

    public function hasActiveLeaseForProperty(Lease $lease): bool
    {
        return DB::table('leases')
            ->where('property_id', $lease->getProperty()->getId())
            ->where('status', 'active')
            ->exists()
        ;
    }

    public function listByOwnerId(Lease $lease): array
    {
        $data = DB::table('leases')
            ->select(
                'id',
                'property_id',
                'tenant_id',
                'due_day',
                'start_date',
                'end_date',
                'rent_amount',
                'status',
            )
            ->where('owner_id', $lease->getOwner()->getId())
            ->orderBy('created_at', 'desc')
            ->get();

        if ($data->isEmpty()) {
            return [];
        }

        return array_map(
            fn ($leaseData) => (new Lease())
                ->setId($leaseData->id)
                ->setProperty((new Property())->setId($leaseData->property_id))
                ->setTenant((new Tenant())->setId($leaseData->tenant_id))
                ->setDueDay((int) $leaseData->due_day)
                ->setStartDate($leaseData->start_date)
                ->setEndDate($leaseData->end_date)
                ->setRentAmount((float) $leaseData->rent_amount)
                ->setStatus($leaseData->status),
            $data->toArray()
        );
    }
}
