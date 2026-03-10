<?php

namespace App\Infrastructure\Auth;

use Core\Domain\Auth\Auth;
use Core\Domain\Auth\AuthRepositoryInterface;
use Illuminate\Support\Facades\DB;

class AuthRepository implements AuthRepositoryInterface
{
    public function createToken(Auth $auth): void
    {
        DB::table('access_tokens')->insert([
            'id' => $auth->getId(),
            'user_id' => $auth->getUser()->getId(),
            'token_hash' => $auth->getTokenHash(),
            'created_at' => now(),
        ]);
    }

    public function findUserIdByTokenHash(string $tokenHash): ?string
    {
        $row = DB::table('access_tokens')
            ->where('token_hash', $tokenHash)
            ->whereNull('revoked_at')
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->first();

        if (! $row) {
            return null;
        }

        DB::table('access_tokens')
            ->where('id', $row->id)
            ->update([
                'last_used_at' => now(),
                'updated_at' => now(),
            ]);

        return $row->user_id;
    }

    public function revokeByTokenHash(string $tokenHash): void
    {
        DB::table('access_tokens')
            ->where('token_hash', $tokenHash)
            ->whereNull('revoked_at')
            ->update([
                'revoked_at' => now(),
                'updated_at' => now(),
            ])
        ;
    }
}
