<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class Employee extends Model
{
    use HasFactory;

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
    ];

    protected function casts(): array
    {
        return [
            'uid' => 'integer',
            'card_number' => 'integer',
            'has_fingerprint' => 'boolean',
            'is_active' => 'boolean',
        ];
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
