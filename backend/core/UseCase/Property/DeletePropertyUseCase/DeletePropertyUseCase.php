<?php

namespace Core\UseCase\Property\DeletePropertyUseCase;

use Core\Domain\User\User;
use Core\Domain\Property\Property;
use Core\Domain\Property\PropertyRepositoryInterface;

class DeletePropertyUseCase
{
    private Property $property;

    public function __construct(
        private PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function execute(DeletePropertyInput $input): void
    {
        $owner = (new User())->setId($input->ownerId);

        $this->property = (new Property())
            ->setOwner($owner)
            ->setId($input->propertyId)
        ;

        $this->checkIfPropertyExist();

        $this->propertyRepository->delete($this->property);
    }

    private function checkIfPropertyExist(): Property
    {
        if (!$this->propertyRepository->loadById($this->property)) {
            throw new \RuntimeException('Property not found.');
        }

        return $this->property;
    }
}
