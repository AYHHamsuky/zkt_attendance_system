<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Contract extends Model
{
    use Searchable;

    public function toSearchableArray(): array
    {
        return [
            'contract_type' => $this->contract_type,
            'status' => $this->status,
            'terms' => $this->terms,
        ];
    }

    protected $fillable = [
        'employee_id',
        'contract_type',
        'start_date',
        'end_date',
        'probation_end_date',
        'salary_amount',
        'terms',
        'status',
        'renewed_from_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'probation_end_date' => 'date',
            'salary_amount' => 'decimal:2',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function renewedFrom(): BelongsTo
    {
        return $this->belongsTo(Contract::class, 'renewed_from_id');
    }

    public function renewals(): HasMany
    {
        return $this->hasMany(Contract::class, 'renewed_from_id');
    }
}
