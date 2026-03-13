<?php

namespace App\Http\Controllers\Api;

use Throwable;
use RuntimeException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Infrastructure\Property\PropertyRepository;
use App\Http\Requests\Property\CreatePropertyRequest;
use App\Http\Requests\Property\DeletePropertyRequest;
use App\Http\Requests\Property\UpdatePropertyRequest;
use Core\UseCase\Property\ShowPropertyUseCase\ShowPropertyInput;
use Core\UseCase\Property\ShowPropertyUseCase\ShowPropertyUseCase;
use Core\UseCase\Property\DeletePropertyUseCase\DeletePropertyInput;
use Core\UseCase\Property\ListPropertiesUseCase\ListPropertiesInput;
use Core\UseCase\Property\CreatePropertyUseCase\CreatePropertyInput;
use Core\UseCase\Property\CreatePropertyUseCase\CreatePropertyUseCase;
use Core\UseCase\Property\DeletePropertyUseCase\DeletePropertyUseCase;
use Core\UseCase\Property\ListPropertiesUseCase\ListPropertiesUseCase;
use Core\UseCase\Property\UpdatePropertyUseCase\UpdatePropertyInput;
use Core\UseCase\Property\UpdatePropertyUseCase\UpdatePropertyUseCase;

class PropertyController extends Controller
{
    public function createProperty(CreatePropertyRequest $request): JsonResponse
    {
        try {
            $input = new CreatePropertyInput(
                city: $request->string('city')->toString(),
                title: $request->string('title')->toString(),
                state: $request->string('state')->toString(),
                ownerId: $request->attributes->get('user_id'),
                street: $request->string('street')->toString(),
                number: $request->string('number')->toString(),
                postalCode: $request->string('postal_code')->toString(),
                description: $request->string('description')->toString(),
                neighborhood: $request->string('neighborhood')->toString(),
            );

            $output = (new CreatePropertyUseCase(new PropertyRepository()))
                ->execute($input)
            ;

            return response()->json(['id' => $output->id], 201);
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

    public function listProperties(Request $request): JsonResponse
    {
        try {
            $input = new ListPropertiesInput($request->attributes->get('user_id'));

            $output = (new ListPropertiesUseCase(new PropertyRepository()))
                ->execute($input)
            ;

            return response()->json(['properties' => $output->properties], 200);
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

    public function deleteProperty(DeletePropertyRequest $request): JsonResponse
    {
        try {
            $input = new DeletePropertyInput(
                propertyId: $request->string('id')->toString(),
                ownerId: $request->attributes->get('user_id'),
            );

            (new DeletePropertyUseCase(new PropertyRepository()))->execute($input);

            return response()->json([
                'message' => 'Property deleted successfully.',
            ], 200);
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

    public function updateProperty(UpdatePropertyRequest $request, string $id): JsonResponse
    {
        try {
            $input = new UpdatePropertyInput(
                propertyId: $id,
                userId: $request->attributes->get('user_id'),
                city: $request->has('city') ? $request->input('city') : null,
                title: $request->has('title') ? $request->input('title') : null,
                state: $request->has('state') ? $request->input('state') : null,
                street: $request->has('street') ? $request->input('street') : null,
                number: $request->has('number') ? $request->input('number') : null,
                postalCode: $request->has('postal_code') ? $request->input('postal_code') : null,
                description: $request->has('description') ? $request->input('description') : null,
                neighborhood: $request->has('neighborhood') ? $request->input('neighborhood') : null,
            );

            (new UpdatePropertyUseCase(new PropertyRepository()))
                ->execute($input)
            ;

            return response()->json([
                'message' => 'Property updated successfully.',
            ], 200);
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

    public function showProperty(UpdatePropertyRequest $request, string $id): JsonResponse
    {
        try {
            $input = new ShowPropertyInput(
                ownerId: $request->attributes->get('user_id'),
                propertyId: $id
            );

            $output = (new ShowPropertyUseCase(new PropertyRepository()))
                ->execute($input)
            ;

            $lease = $output->property->getLease() ? [
                    'id' => $output->property->getLease()->getId(),
                    'tenant_id' => $output->property->getLease()->getTenant()->getId(),
                    'start_date' => $output->property->getLease()->getStartDate(),
                    'end_date' => $output->property->getLease()->getEndDate(),
                    'rent_amount' => $output->property->getLease()->getRentAmount(),
                    'due_day' => $output->property->getLease()->getDueDay(),
                    'status' => $output->property->getLease()->getStatus(),
                ] : null
            ;

            $tenant = $output->property->getLease() ? [
                    'id' => $output->property->getLease()->getTenant()->getId(),
                    'name' => $output->property->getLease()->getTenant()->getName(),
                    'email' => $output->property->getLease()->getTenant()->getEmail(),
                    'phone' => $output->property->getLease()->getTenant()->getPhone(),
                    'document' => $output->property->getLease()->getTenant()->getDocument()
                ] : null
            ;

            $property = [
                'id' => $output->property->getId(),
                'city' => $output->property->getCity(),
                'title' => $output->property->getTitle(),
                'state' => $output->property->getState(),
                'street' => $output->property->getStreet(),
                'number' => $output->property->getNumber(),
                'postal_code' => $output->property->getPostalCode(),
                'description' => $output->property->getDescription(),
                'neighborhood' => $output->property->getNeighborhood(),
            ];

            return response()->json([
                'property' => $property,
                'lease' => $lease,
                'tenant' => $tenant,
            ], 200);
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
