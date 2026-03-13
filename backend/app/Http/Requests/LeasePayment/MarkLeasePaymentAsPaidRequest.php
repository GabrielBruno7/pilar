<?php

namespace App\Http\Requests\LeasePayment;

use Illuminate\Foundation\Http\FormRequest;

class MarkLeasePaymentAsPaidRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'paid_at' => ['nullable', 'date'],
        ];
    }
}
