<?php

namespace Core\UseCase\Property\ListPropertiesUseCase;

use Core\Domain\Property\PropertyRepositoryInterface;

class ListPropertiesUseCase
{
    public function __construct(
        private PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function execute(ListPropertiesInput $input): ListPropertiesOutput
    {
        $properties = $this->propertyRepository->findPropertiesByOwnerId($input->userId);

        $propertyItems = array_map(fn($property) => new ListPropertiesItemOutput(
            id: $property->getId(),
            title: $property->getTitle(),
            status: $property->getStatus(),
            city: $property->getCity(),
            state: $property->getState()
        ), $properties);

        return new ListPropertiesOutput($propertyItems);
    }
}
