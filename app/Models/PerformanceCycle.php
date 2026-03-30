<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PerformanceCycle extends Model
{
    protected $fillable = [
        'name',
        'year',
        'period_type',
        'start_date',
        'end_date',
        'status',
        'scores_visible',
        'current_phase',
        'phase1_open_date',
        'phase1_close_date',
        'phase2_open_date',
        'phase2_close_date',
        'phase3_open_date',
        'phase3_close_date',
    ];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'start_date' => 'date',
            'end_date' => 'date',
            'scores_visible' => 'boolean',
            'phase1_open_date' => 'date',
            'phase1_close_date' => 'date',
            'phase2_open_date' => 'date',
            'phase2_close_date' => 'date',
            'phase3_open_date' => 'date',
            'phase3_close_date' => 'date',
        ];
    }

    /** Check if the given phase number (1, 2, 3) is currently the active phase. */
    public function isPhaseOpen(int $phase): bool
    {
        $phaseMap = [1 => 'planning', 2 => 'tracking', 3 => 'rating'];
        if (($phaseMap[$phase] ?? null) !== $this->current_phase) {
            return false;
        }

        $open = $this->{"phase{$phase}_open_date"};
        $close = $this->{"phase{$phase}_close_date"};
        $today = now()->startOfDay();

        if ($open && $today->lt($open)) {
            return false;
        }
        if ($close && $today->gt($close)) {
            return false;
        }

        return true;
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(PerformanceReview::class, 'cycle_id');
    }
}
