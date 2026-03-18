<?php

namespace Core\Domain\Property;

interface PropertyRepositoryInterface
{
    public function delete(Property $Property): void;
    public function update(Property $Property): void;
    public function loadById(Property $Property): bool;
    public function create(Property $Property): Property;
    public function findPropertiesByOwnerId(string $ownerId): array;
    public function findRecentProperties(Property $property): array;
}
