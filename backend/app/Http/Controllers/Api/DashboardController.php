<?php

namespace App\Http\Controllers\Api;

use Throwable;
use RuntimeException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Core\UseCase\Dashboard\DashboardInput;
use App\Infrastructure\Property\PropertyRepository;
use App\Infrastructure\Dashboard\DashboardRepository;
use Core\UseCase\Dashboard\SummaryUseCase\SummaryUseCase;
use Core\UseCase\Dashboard\ListRecentPropertiesUseCase\ListRecentPropertiesUseCase;
use Core\UseCase\Dashboard\ListPendingPaymentsPreviewUseCase\ListPendingPaymentsPreviewUseCase;

class DashboardController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        try {
            $ownerId = $request->attributes->get('user_id');

            $dashboardInput = new DashboardInput(ownerId: $ownerId);

            $summary = (new SummaryUseCase(new DashboardRepository()))->execute($dashboardInput);

            $recentProperties = (new ListRecentPropertiesUseCase(new PropertyRepository()))
                ->execute($dashboardInput)
            ;

            $pendingPaymentsPreview = (new ListPendingPaymentsPreviewUseCase(new DashboardRepository()))
                ->execute($dashboardInput)
            ;

            return response()->json([
                'summary' => [
                    'active_leases' => $summary->activeLeases,
                    'paid_payments' => $summary->paidPayments,
                    'total_properties' => $summary->totalProperties,
                    'pending_payments' => $summary->pendingPayments,
                    'vacant_properties' => $summary->vacantProperties,
                    'occupied_properties' => $summary->occupiedProperties,
                ],
                'recent_properties' => $recentProperties->properties,
                'pending_payments_preview' => $pendingPaymentsPreview->pendingPayments,
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
