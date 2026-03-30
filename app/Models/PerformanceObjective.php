<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PerformanceObjective extends Model
{
    protected $fillable = [
        'review_id',
        'bsc_category',
        'serial',
        'template_item_id',
        'is_custom',
        'description',
        'kpi',
        'target',
        'weight',
        'score',
        'self_rating',
        'comments',
        'self_remark',
        'progress_status',
        'sort_order',
        'yearly_achieved',
    ];

    protected function casts(): array
    {
        return [
            'is_custom' => 'boolean',
            'weight' => 'decimal:2',
            'score' => 'decimal:2',
            'self_rating' => 'integer',
        ];
    }

    public function review(): BelongsTo
    {
        return $this->belongsTo(PerformanceReview::class, 'review_id');
    }

    public function trackingEntries(): HasMany
    {
        return $this->hasMany(PerformanceTrackingEntry::class, 'objective_id')->latest();
    }

    /**
     * Score contribution: (LM rating / 5) × weight.
     * CSV formula — max contribution per objective equals its weight.
     * E.g. rating=5, weight=20 → (5/5) × 20 = 20.
     */
    public function getContributionAttribute(): float
    {
        if ($this->score === null) {
            return 0.0;
        }

        return round((float) $this->score * (float) $this->weight / 5, 2);
    }
}
