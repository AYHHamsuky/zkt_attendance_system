<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeResignation extends Model
{
    protected $fillable = [
        'employee_id',
        'resignation_date',
        'last_working_date',
        'reason',
        'exit_type',
        'status',
        'handover_completed',
        'exit_interview_completed',
        'clearance_completed',
        'accepted_by',
        'accepted_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'resignation_date' => 'date',
            'last_working_date' => 'date',
            'handover_completed' => 'boolean',
            'exit_interview_completed' => 'boolean',
            'clearance_completed' => 'boolean',
            'accepted_at' => 'datetime',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function acceptedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'accepted_by');
    }
}
