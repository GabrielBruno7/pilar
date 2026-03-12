<?php

namespace App\Infrastructure\Tenant;

use Core\Domain\Tenant\Tenant;
use Illuminate\Support\Facades\DB;
use Core\Domain\Tenant\TenantRepositoryInterface;

class TenantRepository implements TenantRepositoryInterface
{
    public function create(Tenant $tenant): Tenant
    {
        DB::table('tenants')->insert([
            'created_at' => now(),
            'id' => $tenant->getId(),
            'name' => $tenant->getName(),
            'email' => $tenant->getEmail(),
            'phone' => $tenant->getPhone(),
            'document' => $tenant->getDocument(),
            'owner_id' => $tenant->getOwner()->getId(),
        ]);

        return $tenant;
    }

    public function findTenantByDocument(Tenant $tenant): bool
    {
        return DB::table('tenants')
            ->where('document', $tenant->getDocument())
            ->where('owner_id', $tenant->getOwner()->getId())
            ->exists()
        ;
    }

    public function findTenantsByOwnerId(string $ownerId): array
    {
        $data = DB::table('tenants')
            ->select(
                'id',
                'name',
                'email',
                'phone',
                'document'
            )
            ->where('owner_id', $ownerId)
            ->orderBy('created_at', 'desc')
            ->get()
        ;

        if ($data->isEmpty()) {
            return [];
        }

        return array_map(fn($tenantData) => (new Tenant())
            ->setId($tenantData->id)
            ->setName($tenantData->name)
            ->setEmail($tenantData->email)
            ->setPhone($tenantData->phone)
            ->setDocument($tenantData->document),
            $data->toArray())
        ;
    }

    public function loadTenantById(Tenant $tenant): bool
    {
        $result = DB::table('tenants')
            ->where('id', $tenant->getId())
            ->where('owner_id', $tenant->getOwner()->getId())
            ->first()
        ;

        if (!$result) {
            return false;
        }

        $tenant
            ->setName($result->name)
            ->setEmail($result->email)
            ->setPhone($result->phone)
            ->setDocument($result->document)
        ;

        return true;
    }
}
