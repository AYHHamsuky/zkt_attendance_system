<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Collection;
use Laravel\Scout\Searchable;

class Employee extends Model
{
    use HasFactory, Searchable;

    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'user_id' => $this->user_id,
            'email' => $this->email ?? '',
            'department' => $this->department ?? '',
            'unit' => $this->unit ?? '',
            'position' => $this->position ?? '',
            'location' => $this->location ?? '',
            'region' => $this->region ?? '',
        ];
    }

    protected $fillable = [
        'uid',
        'user_id',
        'name',
        'email',
        'phone',
        'department',
        'unit',
        'position',
        'role',
        'card_number',
        'has_fingerprint',
        'is_active',
        'device_id',
        'shift_id',
        'region',
        'location',
        'photo_path',
        'archived_at',
        'archive_reason',
    ];

    protected function casts(): array
    {
        return [
            'uid' => 'integer',
            'card_number' => 'integer',
            'has_fingerprint' => 'boolean',
            'is_active' => 'boolean',
            'archived_at' => 'datetime',
        ];
    }

    public function isArchived(): bool
    {
        return $this->archived_at !== null;
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function attendanceLogs(): HasMany
    {
        return $this->hasMany(AttendanceLog::class);
    }

    public function hrProfile(): HasOne
    {
        return $this->hasOne(HrProfile::class);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function leaveApplications(): HasMany
    {
        return $this->hasMany(LeaveApplication::class);
    }

    public function leaveBalances(): HasMany
    {
        return $this->hasMany(LeaveBalance::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(EmployeeDocument::class);
    }

    public function transfers(): HasMany
    {
        return $this->hasMany(EmployeeTransfer::class);
    }

    public function resignation(): HasOne
    {
        return $this->hasOne(EmployeeResignation::class);
    }

    public function performanceReviews(): HasMany
    {
        return $this->hasMany(PerformanceReview::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(HrAuditLog::class);
    }

    /**
     * Resolve the effective shift for this employee.
     * Priority: assigned shift > unit-based shift > department-based shift > global shift.
     */
    public function resolveShift(Collection $allShifts): ?Shift
    {
        if ($this->shift_id && ($direct = $allShifts->find($this->shift_id))) {
            return $direct;
        }

        if ($this->unit) {
            $byUnit = $allShifts->first(fn (Shift $s) => $s->unit === $this->unit);
            if ($byUnit) {
                return $byUnit;
            }
        }

        if ($this->department) {
            $byDept = $allShifts->first(fn (Shift $s) => $s->department === $this->department && $s->unit === null);
            if ($byDept) {
                return $byDept;
            }
        }

        return $allShifts->first(fn (Shift $s) => $s->department === null && $s->unit === null);
    }
}
