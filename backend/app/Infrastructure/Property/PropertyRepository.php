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
            'user_id' => $property->getUser()->getId(),
            'postal_code' => $property->getPostalCode(),
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
                'street',
                'number',
                'postal_code',
                'description',
                'neighborhood'
            )
            ->where('user_id', $ownerId)
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
            ->setStreet($propertyData->street)
            ->setNumber($propertyData->number)
            ->setPostalCode($propertyData->postal_code)
            ->setDescription($propertyData->description)
            ->setNeighborhood($propertyData->neighborhood)
        , $data->toArray());
    }
}
