<?php

namespace Core\UseCase\Tenant\CreateTenantUseCase;

use RuntimeException;
use Core\Domain\User\User;
use Illuminate\Support\Str;
use Core\Domain\Tenant\Tenant;
use Core\Domain\Tenant\TenantRepositoryInterface;

class CreateTenantUseCase
{
    public function __construct(private TenantRepositoryInterface $tenantRepository) {}

    public function execute(CreateTenantInput $input): CreateTenantOutput
    {
        $tenant = $this->validateInput($input);

        $this->checkIfTenantAlrearyExist($tenant);

        $tenant = $this->tenantRepository->create($tenant);

        return new CreateTenantOutput(id: $tenant->getId());
    }

    private function checkIfTenantAlrearyExist(Tenant $tenant): void
    {
        if ($this->tenantRepository->findTenantByDocument($tenant)) {
            throw new RuntimeException('Tenant with this document already exists.');
        }
    }

    private function validateInput(CreateTenantInput $input): Tenant
    {
        $name = trim($input->name);
        $owner = (new User())->setId($input->ownerId);
        $email = $input->email ? trim($input->email) : null;
        $phone = $input->phone ? trim($input->phone) : null;

        $document = $input->document
            ? preg_replace('/\D+/', '', $input->document)
            : null
        ;

        if ($name === '') {
            throw new RuntimeException('Tenant name is required.');
        }

        return (new Tenant())
            ->setName($name)
            ->setOwner($owner)
            ->setEmail($email)
            ->setPhone($phone)
            ->setDocument($document)
            ->setId((string) Str::uuid())
        ;
    }
}
