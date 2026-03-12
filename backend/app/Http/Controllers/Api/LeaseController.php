<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use Throwable;
use RuntimeException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Infrastructure\User\UserRepository;
use App\Infrastructure\Lease\LeaseRepository;
use App\Infrastructure\Tenant\TenantRepository;
use App\Http\Requests\Lease\CreateLeaseRequest;
use App\Infrastructure\Property\PropertyRepository;
use Core\UseCase\Lease\EndLeaseUseCase\EndLeaseInput;
use Core\UseCase\Lease\EndLeaseUseCase\EndLeaseUseCase;
use Core\UseCase\Lease\ListLeasesUseCase\ListLeasesInput;
use Core\UseCase\Lease\ListLeasesUseCase\ListLeasesUseCase;
use Core\UseCase\Lease\CreateLeaseUseCase\CreateLeaseInput;
use Core\UseCase\Lease\CreateLeaseUseCase\CreateLeaseUseCase;

class LeaseController extends Controller
{
    public function createLease(CreateLeaseRequest $request): JsonResponse
    {
        try {
            $input = new CreateLeaseInput(
                endDate: $request->input('end_date'),
                dueDay: (int) $request->input('due_day'),
                ownerId: $request->attributes->get('user_id'),
                rentAmount: (float) $request->input('rent_amount'),
                tenantId: $request->string('tenant_id')->toString(),
                startDate: $request->string('start_date')->toString(),
                propertyId: $request->string('property_id')->toString(),
            );

            $output = (new CreateLeaseUseCase(
                new UserRepository(),
                new LeaseRepository(),
                new TenantRepository(),
                new PropertyRepository()
            ))->execute($input);

            return response()->json(['id' => $output->id], 201);
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        } catch (Throwable $e) {
            return response()->json([
                'message' => config('app.debug') ? $e->getMessage() : 'Internal server error.',
            ], 500);
        }
    }

    public function listLeases(Request $request): JsonResponse
    {
        try {
            $input = new ListLeasesInput(
                ownerId: $request->attributes->get('user_id'),
            );

            $output = (new ListLeasesUseCase(new LeaseRepository()))
                ->execute($input)
            ;

            return response()->json([
                'leases' => $output->leases,
            ]);
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        } catch (Throwable $e) {
            return response()->json([
                'message' => config('app.debug') ? $e->getMessage() : 'Internal server error.',
            ], 500);
        }
    }

    public function endLease(string $id): JsonResponse
    {
        try {
            $input = new EndLeaseInput(
                id: $id,
            );

            (new EndLeaseUseCase(new LeaseRepository()))
                ->execute($input)
            ;

            return response()->json([
                'message' => 'Lease ended successfully',
            ]);
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        } catch (Throwable $e) {
            return response()->json([
                'message' => config('app.debug') ? $e->getMessage() : 'Internal server error.',
            ], 500);
        }
    }
}
