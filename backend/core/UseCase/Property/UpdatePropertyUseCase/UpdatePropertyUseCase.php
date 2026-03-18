<?php

namespace Core\UseCase\Property\UpdatePropertyUseCase;

use RuntimeException;
use Core\Domain\Property\Property;
use Core\Domain\Property\PropertyRepositoryInterface;
use Core\Domain\User\User;

class UpdatePropertyUseCase
{
    private Property $property;

    public function __construct(
        private PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function execute(UpdatePropertyInput $input): void
    {
        $owner = (new User())->setId($input->userId);

        $this->property = (new Property())
            ->setOwner($owner)
            ->setId($input->propertyId)
        ;
        
        $this->checkIfPropertyExist();

        $this->checkIfPropertyIsDeleted();

        if ($input->title !== null) {
            $this->property->setTitle($input->title);
        }

        if ($input->description !== null) {
            $this->property->setDescription($input->description);
        }

        if ($input->postalCode !== null) {
            $this->property->setPostalCode($input->postalCode);
        }

        if ($input->street !== null) {
            $this->property->setStreet($input->street);
        }

        if ($input->number !== null) {
            $this->property->setNumber($input->number);
        }

        if ($input->neighborhood !== null) {
            $this->property->setNeighborhood($input->neighborhood);
        }

        if ($input->city !== null) {
            $this->property->setCity($input->city);
        }

        if ($input->state !== null) {
            $this->property->setState($input->state);
        }

        if ($input->area !== null) {
            $this->property->setArea($input->area);
        }

        if ($input->parking !== null) {
            $this->property->setParking($input->parking);
        }

        if ($input->bedrooms !== null) {
            $this->property->setBedrooms($input->bedrooms);
        }

        $this->propertyRepository->update($this->property);
    }

    private function checkIfPropertyExist(): Property
    {
        if (!$this->propertyRepository->loadById($this->property)) {
            throw new \RuntimeException('Property not found.');
        }

        return $this->property;
    }

    private function checkIfPropertyIsDeleted(): void
    {
        if ($this->property->getStatus() === Property::STATUS_DELETED) {
            throw new RuntimeException('Deleted properties cannot be updated.');
        }
    }
}
