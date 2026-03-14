<?php

namespace App\Infrastructure\Property;

use Core\Domain\Lease\Lease;
use Core\Domain\Tenant\Tenant;
use Illuminate\Support\Facades\DB;
use Core\Domain\Property\Property;
use Core\Domain\Property\PropertyRepositoryInterface;

class PropertyRepository implements PropertyRepositoryInterface
{
    public function create(Property $property): Property
    {
        DB::table('properties')->insert([
            'created_at' => now(),
            'id' => $property->getId(),
            'city' => $property->getCity(),
            'state' => $property->getState(),
            'title' => $property->getTitle(),
            'street' => $property->getStreet(),
            'number' => $property->getNumber(),
            'postal_code' => $property->getPostalCode(),
            'owner_id' => $property->getOwner()->getId(),
            'description' => $property->getDescription(),
            'neighborhood' => $property->getNeighborhood(),
        ]);

        return $property;
    }

    public function findPropertiesByOwnerId(string $ownerId): array
    {
        $data = DB::table('properties')
            ->select(
                'id',
                'city',
                'state',
                'title',
                'status',
                'street',
                'number',
                'postal_code',
                'description',
                'neighborhood'
            )
            ->where('owner_id', $ownerId)
            ->orderBy('created_at', 'desc')
            ->get()
        ;

        if ($data->isEmpty()) {
            return [];
        }

        return array_map(fn($propertyData) => (new Property())
            ->setId($propertyData->id)
            ->setCity($propertyData->city)
            ->setState($propertyData->state)
            ->setTitle($propertyData->title)
            ->setStatus($propertyData->status)
            ->setStreet($propertyData->street)
            ->setNumber($propertyData->number)
            ->setPostalCode($propertyData->postal_code)
            ->setDescription($propertyData->description)
            ->setNeighborhood($propertyData->neighborhood)
        , $data->toArray());
    }

    public function findRecentProperties(Property $property): array
    {
        $data = DB::table('properties')
            ->select(
                'id',
                'city',
                'state',
                'title',
                'status',
                'street',
                'number',
                'postal_code',
                'description',
                'neighborhood'
            )
            ->where('owner_id', $property->getOwner()->getId())
            ->where('status', Property::STATUS_ACTIVE)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
        ;

        if ($data->isEmpty()) {
            return [];
        }

        $properties = [];

        foreach ($data as $propertyData) {
            $properties[] = (new Property())
                ->setId($propertyData->id)
                ->setCity($propertyData->city)
                ->setState($propertyData->state)
                ->setTitle($propertyData->title)
                ->setStatus($propertyData->status)
                ->setStreet($propertyData->street)
                ->setNumber($propertyData->number)
                ->setPostalCode($propertyData->postal_code)
                ->setDescription($propertyData->description)
                ->setNeighborhood($propertyData->neighborhood)
            ;
        }

        return $properties;
    }

    public function loadById(Property $property): bool
    {
        $result = DB::table('properties as p')
            ->select(
                'p.id',
                'p.city',
                'p.state',
                'p.title',
                'p.status',
                'p.street',
                'p.number',
                'p.postal_code',
                'p.description',
                'p.neighborhood',
                'l.id as lease_id',
                'l.start_date as lease_start_date',
                'l.end_date as lease_end_date',
                'l.rent_amount as lease_rent_amount',
                'l.due_day as lease_due_day',
                'l.status as lease_status',
                't.id as tenant_id',
                't.name as tenant_name',
                't.email as tenant_email',
                't.phone as tenant_phone',
                't.document as tenant_document',
            )
            ->join('users as u', 'u.id', '=', 'p.owner_id')
            ->leftJoin('leases as l', 'l.property_id', '=', 'p.id')
            ->leftJoin('tenants as t', 't.id', '=', 'l.tenant_id')
            ->where('p.id', $property->getId())
            ->where('p.owner_id', $property->getOwner()->getId())
            ->first()
        ;

        if (!$result) {
            return false;
        }

        $lease = null;

        if (!is_null($result->lease_id)) {
            $lease = $this->buildLease($result);

            if (!is_null($result->tenant_id)) {
                $lease = $this->buildTenant($result, $lease);
            }
        }

        $property
            ->setLease($lease)
            ->setCity($result->city)
            ->setTitle($result->title)
            ->setState($result->state)
            ->setStatus($result->status)
            ->setStatus($result->status)
            ->setStreet($result->street)
            ->setNumber($result->number)
            ->setPostalCode($result->postal_code)
            ->setDescription($result->description)
            ->setNeighborhood($result->neighborhood)
        ;

        return true;
    }

    private function buildLease($result): Lease
    {
        $lease = (new Lease())
            ->setId($result->lease_id)
            ->setStartDate($result->lease_start_date)
            ->setEndDate($result->lease_end_date)
            ->setRentAmount($result->lease_rent_amount)
            ->setDueDay($result->lease_due_day)
            ->setStatus($result->lease_status)
        ;

        return $lease;
    }

    private function buildTenant($result, Lease $lease): Lease
    {
        $tenant = (new Tenant())
            ->setId($result->tenant_id)
            ->setName($result->tenant_name)
            ->setEmail($result->tenant_email)
            ->setPhone($result->tenant_phone)
            ->setDocument($result->tenant_document)
        ;

        $lease->setTenant($tenant);

        return $lease;
    }

    public function delete(Property $property): void
    {
        DB::table('properties')
            ->where('id', $property->getId())
            ->where('owner_id', $property->getOwner()->getId())
            ->update([
                'status' => Property::STATUS_DELETED,
                'updated_at' => now(),
                'deleted_at' => now()
            ])
        ;
    }

    public function update(Property $property): void
    {
        DB::table('properties')
            ->where('id', $property->getId())
            ->where('owner_id', $property->getOwner()->getId())
            ->update([
                'title' => $property->getTitle(),
                'description' => $property->getDescription(),
                'postal_code' => $property->getPostalCode(),
                'street' => $property->getStreet(),
                'number' => $property->getNumber(),
                'neighborhood' => $property->getNeighborhood(),
                'city' => $property->getCity(),
                'state' => $property->getState(),
                'updated_at' => now(),
            ])
        ;
    }
}
