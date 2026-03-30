<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaveType extends Model
{
    protected $fillable = [
        'name',
        'days_allowed_per_year',
        'is_paid',
        'gender_restriction',
        'requires_approval',
        'requires_reliever',
        'requires_document',
        'document_label',
        'description',
        'hr_email',
    ];

    protected function casts(): array
    {
        return [
            'is_paid' => 'boolean',
            'requires_approval' => 'boolean',
            'requires_reliever' => 'boolean',
            'requires_document' => 'boolean',
            'days_allowed_per_year' => 'integer',
        ];
    }

    public function applications(): HasMany
    {
        return $this->hasMany(LeaveApplication::class);
    }

    public function balances(): HasMany
    {
        return $this->hasMany(LeaveBalance::class);
    }
}
