<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'uid',
        'employee_id',
        'device_id',
        'timestamp',
        'state',
        'type',
    ];

    protected function casts(): array
    {
        return [
            'timestamp' => 'datetime',
            'state' => 'integer',
            'type' => 'integer',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    /**
     * Get human-readable state label.
     */
    public function getStateLabelAttribute(): string
    {
        return match ($this->state) {
            0 => 'Check In',
            1 => 'Check Out',
            2 => 'Break Out',
            3 => 'Break In',
            4 => 'OT In',
            5 => 'OT Out',
            default => 'Unknown',
        };
    }

    /**
     * Get human-readable verification type label.
     */
    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            1 => 'Fingerprint',
            4 => 'Card',
            15 => 'Face',
            255 => 'Web',
            default => 'Other',
        };
    }
}
