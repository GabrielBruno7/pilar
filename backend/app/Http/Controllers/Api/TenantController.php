<?php

namespace App\Http\Controllers\Api;

use Throwable;
use RuntimeException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Infrastructure\Tenant\TenantRepository;
use App\Http\Requests\Tenant\CreateTenantRequest;
use Core\UseCase\Tenant\CreateTenantUseCase\CreateTenantInput;
use Core\UseCase\Tenant\CreateTenantUseCase\CreateTenantUseCase;
use Core\UseCase\Tenant\ListTenantsUseCase\ListTenantsInput;
use Core\UseCase\Tenant\ListTenantsUseCase\ListTenantsUseCase;

class TenantController extends Controller
{
    public function createTenant(CreateTenantRequest $request): JsonResponse
    {
        try {
            $input = new CreateTenantInput(
                email: $request->input('email'),
                phone: $request->input('phone'),
                document: $request->input('document'),
                name: $request->string('name')->toString(),
                ownerId: $request->attributes->get('user_id'),
            );

            $output = (new CreateTenantUseCase(new TenantRepository()))
                ->execute($input)
            ;

            return response()->json([
                'id' => $output->id,
            ], 201);
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        } catch (Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'class' => get_class($e),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }

    public function listTenants(Request $request): JsonResponse
    {
        try {
            $input = new ListTenantsInput(
                ownerId: $request->attributes->get('user_id'),
            );

            $output = (new ListTenantsUseCase(new TenantRepository()))
                ->execute($input)
            ;

            return response()->json($output->tenants, 200);
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        } catch (Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'class' => get_class($e),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }
}
