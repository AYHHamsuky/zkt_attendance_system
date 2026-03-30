<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class LeaveApplication extends Model
{
    use Searchable;

    public function toSearchableArray(): array
    {
        return [
            'status' => $this->status,
            'reason' => $this->reason,
        ];
    }

    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'start_date',
        'end_date',
        'days_requested',
        'reason',
        'status',
        'approved_by',
        'approved_at',
        'rejection_reason',
        'reliever_employee_id',
        'lm_approved_by',
        'lm_approved_at',
        'lm_rejection_reason',
        'line_manager_email',
        'document_path',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'days_requested' => 'integer',
            'approved_at' => 'datetime',
            'lm_approved_at' => 'datetime',
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

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function lmApprovedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'lm_approved_by');
    }

    public function reliever(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'reliever_employee_id');
    }
}
