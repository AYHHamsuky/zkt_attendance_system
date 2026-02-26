<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'department',
        'unit',
        'expected_check_in',
        'expected_check_out',
        'grace_period_minutes',
    ];

    protected function casts(): array
    {
        return [
            'grace_period_minutes' => 'integer',
        ];
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    /**
     * Human-readable label for this shift.
     */
    public function getScopeAttribute(): string
    {
        if ($this->unit) {
            return "Unit: {$this->unit}";
        }

        if ($this->department) {
            return "Dept: {$this->department}";
        }

        return 'Global';
    }
}
