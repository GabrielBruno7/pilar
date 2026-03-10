<?php

namespace App\Infrastructure\User;

use Core\Domain\User\User;
use Core\Domain\User\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;

class UserRepository implements UserRepositoryInterface
{
    public function loadByEmail(string $email): ?User
    {
        $result = DB::table('users')
            ->where('email', $email)
            ->first()
        ;

        if (!$result) {
            return null;
        }

        $user = (new User())
            ->setId($result->id)
            ->setName($result->name)
            ->setEmail($result->email)
            ->setPasswordHash($result->password_hash)
        ;

        return $user;
    }

    public function loadById(string $id): ?User
    {
        $result = DB::table('users')
            ->where('id', $id)
            ->first()
        ;

        if (!$result) {
            return null;
        }

        $user = (new User())
            ->setId($result->id)
            ->setName($result->name)
            ->setEmail($result->email)
            ->setPasswordHash($result->password_hash)
        ;

        return $user;
    }

    public function create(User $user): User
    {
        DB::table('users')->insert([
            'id' => $user->getId(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'password_hash' => $user->getPasswordHash(),
            'created_at' => now(),
            'updated_at' => null,
        ]);

        return $user;
    }
}
