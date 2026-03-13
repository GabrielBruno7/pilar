<?php

namespace Core\UseCase\Property\ShowPropertyUseCase;

use Core\Domain\User\User;
use Core\Domain\Property\Property;
use Core\Domain\Property\PropertyRepositoryInterface;

class ShowPropertyUseCase
{
    private Property $property;

    public function __construct(
        private PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function execute(ShowPropertyInput $input): ShowPropertyOutput
    {
        $owner = (new User())->setId($input->ownerId);

        $this->property = (new Property())
            ->setOwner($owner)
            ->setId($input->propertyId)
        ;

        $this->checkIfPropertyExists();

        return new ShowPropertyOutput($this->property);
    }

    private function checkIfPropertyExists(): Property
    {
        if (!$this->propertyRepository->loadById($this->property)) {
            throw new \RuntimeException('Property not found');
        }

        return $this->property;
    }
}
