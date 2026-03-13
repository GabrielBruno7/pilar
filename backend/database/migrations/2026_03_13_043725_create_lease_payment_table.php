<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lease_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('owner_id');
            $table->foreign('owner_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete()
            ;

            $table->uuid('lease_id');
            $table->foreign('lease_id')
                ->references('id')
                ->on('leases')
                ->cascadeOnDelete()
            ;

            $table->string('reference_month', 7);
            $table->date('due_date');
            $table->decimal('expected_amount', 10, 2);

            $table->timestamp('paid_at')->nullable();
            $table->enum('status', ['pending', 'paid', 'overdue'])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lease_payments');
    }
};