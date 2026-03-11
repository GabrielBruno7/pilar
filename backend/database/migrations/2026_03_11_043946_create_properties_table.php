<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('owner_id');
            $table->foreign('owner_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete()
            ;

            $table->string('title');
            $table->text('description')->nullable();

            $table->string('postal_code', 20)->nullable();
            $table->string('street')->nullable();
            $table->string('number', 20)->nullable();
            $table->string('neighborhood')->nullable();
            $table->string('city')->nullable();
            $table->string('state', 10)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
