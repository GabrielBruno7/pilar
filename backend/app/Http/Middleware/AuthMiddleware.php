<?php

namespace App\Http\Middleware;

use Closure;
use Core\Domain\Auth\AuthRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthMiddleware
{
    public function __construct(private AuthRepositoryInterface $authPersistence) {}

    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->header('Authorization');

        if (!$header || !str_starts_with($header, 'Bearer ')) {
            return new JsonResponse(['message' => 'Não autenticado.'], 401);
        }

        $plainToken = substr($header, 7);
        $tokenHash = hash('sha256', $plainToken);

        $userId = $this->authPersistence->findUserIdByTokenHash($tokenHash);

        if (! $userId) {
            return new JsonResponse(['message' => 'Token inválido.'], 401);
        }

        $request->attributes->set('user_id', $userId);
        $request->attributes->set('plain_token', $plainToken);

        return $next($request);
    }
}
