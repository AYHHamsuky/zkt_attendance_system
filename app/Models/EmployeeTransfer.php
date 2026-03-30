<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeTransfer extends Model
{
    protected $fillable = [
        'employee_id',
        'from_department',
        'from_unit',
        'from_location',
        'from_position',
        'to_department',
        'to_unit',
        'to_location',
        'to_position',
        'reason',
        'effective_date',
        'status',
        'approved_by',
        'approved_at',
        'initiated_by',
    ];

    protected function casts(): array
    {
        return [
            'effective_date' => 'date',
            'approved_at' => 'datetime',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function initiatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'initiated_by');
    }
}
