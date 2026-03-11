<?php

namespace Core\Domain\Property;

interface PropertyRepositoryInterface
{
    public function create(Property $Property): Property;
    public function findPropertiesByOwnerId(string $ownerId): array;
}
