<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leases', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('owner_id');
            $table->foreign('owner_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete()
            ;

            $table->uuid('property_id');
            $table->foreign('property_id')
                ->references('id')
                ->on('properties')
                ->cascadeOnDelete()
            ;

            $table->uuid('tenant_id');
            $table->foreign('tenant_id')
                ->references('id')
                ->on('tenants')
                ->cascadeOnDelete()
            ;

            $table->unsignedTinyInteger('due_day');

            $table->date('start_date');
            $table->date('end_date')->nullable();

            $table->decimal('rent_amount', 10, 2);
            $table->enum('status', ['active', 'deleted', 'ended'])->default('active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leases');
    }
};
