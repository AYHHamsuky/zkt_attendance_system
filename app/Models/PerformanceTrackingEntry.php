<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformanceTrackingEntry extends Model
{
    protected $fillable = [
        'objective_id',
        'period',
        'status',
        'remarks',
        'tracked_by',
    ];

    public function objective(): BelongsTo
    {
        return $this->belongsTo(PerformanceObjective::class, 'objective_id');
    }

    public function trackedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tracked_by');
    }
}
