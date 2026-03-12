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
        $results = DB::table('leases as l')
            ->select(
                'l.id',
                'l.property_id',
                'l.tenant_id',
                'p.title as property_title',
                'p.id as property_id',
                't.name as tenant_name',
                't.id as tenant_id',
                'l.due_day',
                'l.start_date',
                'l.end_date',
                'l.rent_amount',
                'l.status',
            )
            ->where('l.owner_id', $lease->getOwner()->getId())
            ->join('properties as p', 'l.property_id', '=', 'p.id')
            ->join('tenants as t', 'l.tenant_id', '=', 't.id')
            ->orderBy('l.created_at', 'desc')
            ->get()
            ->toArray()
        ;

        if (empty($results)) {
            return [];
        }

        $leases = [];

        foreach ($results as $result) {
            $property = (new Property())
                ->setId($result->property_id)
                ->setTitle($result->property_title)
            ;

            $tenant = (new Tenant())
                ->setId($result->tenant_id)
                ->setName($result->tenant_name)
            ;

            $lease = (new Lease())
                ->setId($result->id)
                ->setTenant($tenant)
                ->setProperty($property)
                ->setStatus($result->status)
                ->setDueDay($result->due_day)
                ->setEndDate($result->end_date)
                ->setStartDate($result->start_date)
                ->setRentAmount($result->rent_amount)
            ;

            $leases[] = $lease;
        }

        return $leases;
    }
}
