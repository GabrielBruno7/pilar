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
}
