<?php

namespace Core\UseCase\Dashboard\ListRecentPropertiesUseCase;

use Core\Domain\User\User;
use Core\Domain\Property\Property;
use Core\UseCase\Dashboard\DashboardInput;
use Core\Domain\Property\PropertyRepositoryInterface;

class ListRecentPropertiesUseCase
{
    public function __construct(
        private PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function execute(DashboardInput $input): ListRecentPropertiesOutput
    {
        $owner = (new User())->setId($input->ownerId);

        $property = (new Property())->setOwner($owner);

        $properties = $this->propertyRepository->findRecentProperties($property);

        $propertyItems = array_map(fn($property) => new ListRecentPropertiesItemOutput(
            id: $property->getId(),
            city: $property->getCity(),
            state: $property->getState(),
            title: $property->getTitle(),
            status: $property->getStatus(),
        ), $properties);

        return new ListRecentPropertiesOutput($propertyItems);
    }
}
