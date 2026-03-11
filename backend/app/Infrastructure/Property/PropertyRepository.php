<?php

namespace App\Infrastructure\Property;

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

    public function loadById(Property $property): bool
    {
        $result = DB::table('properties')
            ->where('id', $property->getId())
            ->where('owner_id', $property->getOwner()->getId())
            ->first()
        ;

        if (!$result) {
            return false;
        }

        $property
            ->setTitle($result->title)
            ->setDescription($result->description)
        ;

        return true;
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
}
