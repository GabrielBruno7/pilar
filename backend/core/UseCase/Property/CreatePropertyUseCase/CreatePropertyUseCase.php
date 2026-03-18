<?php

namespace Core\UseCase\Property\CreatePropertyUseCase;

use Core\Domain\User\User;
use Illuminate\Support\Str;
use Core\Domain\Property\Property;
use Core\Domain\Property\PropertyRepositoryInterface;

class CreatePropertyUseCase
{
    public function __construct(
        private PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function execute(CreatePropertyInput $input): CreatePropertyOutput
    {
        $owner = (new User())->setId($input->ownerId);

        $property = (new Property())
            ->setOwner($owner)
            ->setCity($input->city)
            ->setArea($input->area)
            ->setState($input->state)
            ->setTitle($input->title)
            ->setStreet($input->street)
            ->setNumber($input->number)
            ->setParking($input->parking)
            ->setId((string) Str::uuid())
            ->setBedrooms($input->bedrooms)
            ->setPostalCode($input->postalCode)
            ->setDescription($input->description)
            ->setNeighborhood($input->neighborhood)
        ;

        $property = $this->propertyRepository->create($property);

        return new CreatePropertyOutput(
            $property->getId()
        );
    }
}
