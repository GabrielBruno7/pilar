<?php

namespace App\Http\Requests\Property;

use Illuminate\Foundation\Http\FormRequest;

final class CreatePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'description' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:10'],
            'area' => ['nullable', 'numeric', 'min:0'],
            'title' => ['required', 'string', 'max:255'],
            'number' => ['nullable', 'string', 'max:20'],
            'street' => ['nullable', 'string', 'max:255'],
            'parking' => ['nullable', 'integer', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'neighborhood' => ['nullable', 'string', 'max:255'],
        ];
    }
}
