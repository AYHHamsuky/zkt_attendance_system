<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveBalance extends Model
{
    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'year',
        'days_allowed',
        'days_taken',
        'days_pending',
    ];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'days_allowed' => 'integer',
            'days_taken' => 'integer',
            'days_pending' => 'integer',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function leaveType(): BelongsTo
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function getRemainingDaysAttribute(): int
    {
        return $this->days_allowed - $this->days_taken - $this->days_pending;
    }
}
