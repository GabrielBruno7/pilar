<?php

namespace App\Infrastructure\Dashboard;

use Core\Domain\Lease\Lease;
use Illuminate\Support\Facades\DB;
use Core\Domain\Property\Property;
use Core\Domain\Dashboard\Dashboard;
use Core\Domain\LeasePayment\LeasePayment;
use Core\Domain\Dashboard\DashboardRepositoryInterface;

class DashboardRepository implements DashboardRepositoryInterface
{
    public function countProperties(Dashboard $dashboard): int
    {
        return DB::table('properties')
            ->where('owner_id', $dashboard->getOwner()->getId())
            ->where('status', Property::STATUS_ACTIVE)
            ->count()
        ;
    }

    public function countActiveLeases(Dashboard $dashboard): int
    {
        return DB::table('leases')
            ->where('owner_id', $dashboard->getOwner()->getId())
            ->where('status', Lease::STATUS_ACTIVE)
            ->count()
        ;
    }

    public function countPaidPayments(Dashboard $dashboard): int
    {
        return DB::table('lease_payments')
            ->where('owner_id', $dashboard->getOwner()->getId())
            ->where('status', LeasePayment::STATUS_PAID)
            ->count()
        ;
    }

    public function countPendingPayments(Dashboard $dashboard): int
    {
        return DB::table('lease_payments')
            ->where('owner_id', $dashboard->getOwner()->getId())
            ->whereIn('status', [LeasePayment::STATUS_PENDING, LeasePayment::STATUS_OVERDUE])
            ->count()
        ;
    }

    public function countOccupiedProperties(Dashboard $dashboard): int
    {
        return DB::table('leases as l')
            ->join('properties as p', 'p.id', '=', 'l.property_id')
            ->where('l.owner_id', $dashboard->getOwner()->getId())
            ->where('l.status', Lease::STATUS_ACTIVE)
            ->where('p.status', Property::STATUS_ACTIVE)
            ->distinct()
            ->count('l.property_id')
        ;
    }

    public function countVacantProperties(Dashboard $dashboard): int
    {
        $totalActiveProperties = DB::table('properties')
            ->where('owner_id', $dashboard->getOwner()->getId())
            ->where('status', Property::STATUS_ACTIVE)
            ->count()
        ;

        $occupiedProperties = DB::table('properties as p')
            ->join('leases as l', 'l.property_id', '=', 'p.id')
            ->where('p.owner_id', $dashboard->getOwner()->getId())
            ->where('p.status', Property::STATUS_ACTIVE)
            ->where('l.status', Lease::STATUS_ACTIVE)
            ->distinct()
            ->count('p.id')
        ;

        return $totalActiveProperties - $occupiedProperties;
    }

    public function findPendingPaymentsPreview(Dashboard $dashboard): array
    {
        return DB::table('lease_payments as lp')
            ->select(
                'lp.id',
                'lp.status',
                'lp.reference_month',
                'lp.due_date',
                'lp.expected_amount',
                'p.id as property_id',
                'p.title as property_title',
                'p.city as property_city',
                'p.state as property_state',
                't.id as tenant_id',
                't.name as tenant_name'
            )
            ->join('leases as l', 'l.id', '=', 'lp.lease_id')
            ->join('properties as p', 'p.id', '=', 'l.property_id')
            ->join('tenants as t', 't.id', '=', 'l.tenant_id')
            ->where('lp.owner_id', $dashboard->getOwner()->getId())
            ->whereIn('lp.status', [LeasePayment::STATUS_PENDING, LeasePayment::STATUS_OVERDUE])
            ->where('p.status', Property::STATUS_ACTIVE)
            ->orderByRaw("
                CASE
                    WHEN lp.status = 'overdue' THEN 1
                    WHEN lp.status = 'pending' THEN 2
                    ELSE 3
                END
            ")
            ->orderBy('lp.due_date', 'asc')
            ->limit(5)
            ->get()
            ->toArray()
        ;
    }
}
