<?php

namespace App\Http\Controllers\Api;

use Throwable;
use RuntimeException;
use App\Http\Controllers\Controller;
use App\Infrastructure\Property\PropertyRepository;
use App\Http\Requests\Property\CreatePropertyRequest;
use Core\UseCase\Property\CreatePropertyUseCase\CreatePropertyInput;
use Core\UseCase\Property\CreatePropertyUseCase\CreatePropertyUseCase;

class PropertyController extends Controller
{
    public function createProperty(CreatePropertyRequest $request)
    {
        try {
            $input = new CreatePropertyInput(
                city: $request->string('city')->toString(),
                title: $request->string('title')->toString(),
                state: $request->string('state')->toString(),
                userId: $request->attributes->get('user_id'),
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
            report($e);

            return response()->json([
                'message' => 'Internal server error.',
            ], 500);
        }
    }
}
