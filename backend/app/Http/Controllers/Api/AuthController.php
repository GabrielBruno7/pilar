<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Infrastructure\Auth\AuthRepository;
use App\Infrastructure\User\UserRepository;
use Core\UseCase\Auth\LogoutUseCase\LogoutInput;
use Core\UseCase\Auth\MeUseCase\MeInput;
use Core\UseCase\Auth\LoginUseCase\LoginInput;
use Core\UseCase\Auth\RegisterUseCase\RegisterInput;
use Core\UseCase\Auth\LoginUseCase\LoginUseCase;
use Core\UseCase\Auth\LogoutUseCase\LogoutUseCase;
use Core\UseCase\Auth\MeUseCase\MeUseCase;
use Core\UseCase\Auth\RegisterUseCase\RegisterUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $useCase = new RegisterUseCase(new UserRepository());

            $input = new RegisterInput(
                name: $request->string('name')->toString(),
                email: $request->string('email')->toString(),
                password: $request->string('password')->toString(),
            );

            $output = $useCase->execute($input);

            return response()->json(['id' => $output->id], 201);
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $input = new LoginInput(
                email: $request->string('email')->toString(),
                password: $request->string('password')->toString(),
            );

            $output = (new LoginUseCase(
                new UserRepository(),
                new AuthRepository()
            ))->execute($input);

            return response()->json([
                'name' => $output->name,
                'email' => $output->email,
                'access_token' => $output->accessToken,
            ]);
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 401);
        }
    }

    public function me(Request $request): JsonResponse
    {
        $input = new MeInput($request->attributes->get('user_id'));

        $output = (new MeUseCase(new UserRepository()))->execute($input);

        return response()->json([
            'id' => $output->id,
            'name' => $output->name,
            'email' => $output->email,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $input = new LogoutInput($request->attributes->get('plain_token'));

        (new LogoutUseCase(new AuthRepository()))->execute($input);

        return response()->json([
            'message' => 'Logout realizado com sucesso.',
        ]);
    }
}
