<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'position',
        'role',
        'card_number',
        'has_fingerprint',
        'is_active',
        'device_id',
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

    public function attendanceLogs(): HasMany
    {
        return $this->hasMany(AttendanceLog::class);
    }
}
