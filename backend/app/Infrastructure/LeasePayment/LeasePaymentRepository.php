<?php

namespace App\Infrastructure\LeasePayment;

use Core\Domain\Lease\Lease;
use Core\Domain\Tenant\Tenant;
use Core\Domain\Property\Property;
use Illuminate\Support\Facades\DB;
use Core\Domain\LeasePayment\LeasePayment;
use Core\Domain\LeasePayment\LeasePaymentRepositoryInterface;

class LeasePaymentRepository implements LeasePaymentRepositoryInterface
{
    public function create(LeasePayment $leasePayment): LeasePayment
    {
        DB::table('lease_payments')->insert([
            'id' => $leasePayment->getId(),
            'owner_id' => $leasePayment->getOwner()->getId(),
            'lease_id' => $leasePayment->getLease()->getId(),
            'reference_month' => $leasePayment->getReferenceMonth(),
            'due_date' => $leasePayment->getDueDate(),
            'expected_amount' => $leasePayment->getExpectedAmount(),
            'paid_at' => $leasePayment->getPaidAt(),
            'status' => $leasePayment->getStatus(),
            'created_at' => now(),
        ]);

        return $leasePayment;
    }

    public function existsByLeaseIdAndReferenceMonth(LeasePayment $leasePayment): bool
    {
        return DB::table('lease_payments')
            ->where('lease_id', $leasePayment->getLease()->getId())
            ->where('reference_month', $leasePayment->getReferenceMonth())
            ->exists()
        ;
    }

    public function listByOwnerId(LeasePayment $leasePayment): array
    {
        $results = DB::table('lease_payments as lp')
            ->select(
                'lp.id',
                'lp.lease_id',
                'lp.reference_month',
                'lp.due_date',
                'lp.expected_amount',
                'lp.paid_at',
                'lp.status',
                'p.title as property_title',
                'p.id as property_id',
                't.name as tenant_name',
                't.id as tenant_id',
                'l.id as lease_id',
            )
            ->join('leases as l', 'l.id', '=', 'lp.lease_id')
            ->join('properties as p', 'p.id', '=', 'l.property_id')
            ->join('tenants as t', 't.id', '=', 'l.tenant_id')
            ->where('lp.owner_id', $leasePayment->getOwner()->getId())
            ->orderByDesc('lp.created_at')
            ->get()
            ->toArray()
        ;

        if (empty($results)) {
            return [];
        }

        $leasePayments = [];

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
                ->setId($result->lease_id)
                ->setTenant($tenant)
                ->setProperty($property)
            ;

            $leasePayment = (new LeasePayment())
                ->setLease($lease)
                ->setId($result->id)
                ->setStatus($result->status)
                ->setDueDate($result->due_date)
                ->setReferenceMonth($result->reference_month)
                ->setExpectedAmount($result->expected_amount)
                ->setPaidAt($result->paid_at ? $result->paid_at : null)
            ;

            $leasePayments[] = $leasePayment;
        }

        return $leasePayments;
    }

    public function findByIdAndOwnerId(LeasePayment $leasePayment): bool
    {
        $result = DB::table('lease_payments')
            ->where('id', $leasePayment->getId())
            ->where('owner_id', $leasePayment->getOwner()->getId())
            ->first()
        ;

        if (!$result) {
            return false;
        }

        $leasePayment->setStatus($result->status);

        return true;
    }

    public function update(LeasePayment $leasePayment): void
    {
        DB::table('lease_payments')
            ->where('id', $leasePayment->getId())
            ->update([
                'paid_at' => $leasePayment->getPaidAt(),
                'status' => $leasePayment->getStatus(),
                'updated_at' => now(),
            ])
        ;
    }
}
