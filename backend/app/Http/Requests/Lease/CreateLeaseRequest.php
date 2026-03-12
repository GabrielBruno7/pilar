<?php

namespace App\Http\Requests\Lease;

use Illuminate\Foundation\Http\FormRequest;

final class CreateLeaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'property_id' => ['required', 'uuid'],
            'tenant_id' => ['required', 'uuid'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date'],
            'rent_amount' => ['required', 'numeric', 'gt:0'],
            'due_day' => ['required', 'integer', 'between:1,31'],
        ];
    }
}
