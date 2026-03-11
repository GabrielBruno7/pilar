<?php

namespace App\Http\Requests\Property;

use Illuminate\Foundation\Http\FormRequest;

class DeletePropertyRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['required', 'uuid'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'id' => $this->route('id'),
        ]);
    }
}
