<?php

namespace App\Http\Controllers\Api;

use Throwable;
use RuntimeException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\LeasePayment\MarkLeasePaymentAsPaidRequest;
use App\Infrastructure\LeasePayment\LeasePaymentRepository;
use Core\UseCase\LeasePayment\ListLeasePaymentsUseCase\ListLeasePaymentsInput;
use Core\UseCase\LeasePayment\ListLeasePaymentsUseCase\ListLeasePaymentsUseCase;
use Core\UseCase\LeasePayment\MarkLeasePaymentAsPaidUseCase\MarkLeasePaymentAsPaidInput;
use Core\UseCase\LeasePayment\MarkLeasePaymentAsPaidUseCase\MarkLeasePaymentAsPaidUseCase;

class LeasePaymentController extends Controller
{
    public function listLeasePayments(Request $request): JsonResponse
    {
        try {
            $input = new ListLeasePaymentsInput(
                ownerId: $request->attributes->get('user_id'),
            );

            $output = (new ListLeasePaymentsUseCase(new LeasePaymentRepository()))
                ->execute($input)
            ;

            return response()->json(['payments' => $output->payments]);
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

    public function markAsPaid(MarkLeasePaymentAsPaidRequest $request, string $id): JsonResponse
    {
        try {
            $input = new MarkLeasePaymentAsPaidInput(
                leasePaymentId: $id,
                ownerId: $request->attributes->get('user_id'),
                paidAt: $request->input('paid_at'),
            );

            $output = (new MarkLeasePaymentAsPaidUseCase(new LeasePaymentRepository()))
                ->execute($input)
            ;

            return response()->json(['id' => $output->id]);
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
