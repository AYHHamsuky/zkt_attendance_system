<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class PerformanceReview extends Model
{
    use Searchable;

    public function toSearchableArray(): array
    {
        return [
            'status' => $this->status,
            'self_assessment' => $this->self_assessment,
            'employee_comment' => $this->employee_comment,
            'reviewer_comments' => $this->reviewer_comments,
        ];
    }

    protected $fillable = [
        'employee_id',
        'job_role_title',
        'cycle_id',
        'reviewer_id',
        'template_id',
        'status',
        'self_assessment',
        'employee_comment',
        'training_needs',
        'overall_score',
        'reviewer_comments',
        'submitted_at',
        'acknowledged_at',
        'reviewed_at',
        'notify_sent_at',
        'employee_agreed_at',
        'manager_agreed_at',
        'planning_locked_at',
        'hr_approved_at',
        'hr_rejected_at',
        'hr_rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'overall_score' => 'decimal:2',
            'submitted_at' => 'datetime',
            'acknowledged_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'notify_sent_at' => 'datetime',
            'employee_agreed_at' => 'datetime',
            'manager_agreed_at' => 'datetime',
            'planning_locked_at' => 'datetime',
            'hr_approved_at' => 'datetime',
            'hr_rejected_at' => 'datetime',
        ];
    }

    public function isPlanningLocked(): bool
    {
        return $this->planning_locked_at !== null;
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function cycle(): BelongsTo
    {
        return $this->belongsTo(PerformanceCycle::class, 'cycle_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(PerformanceTemplate::class, 'template_id');
    }

    public function objectives(): HasMany
    {
        return $this->hasMany(PerformanceObjective::class, 'review_id')->orderBy('sort_order')->orderBy('id');
    }

    public function trainingNeeds(): HasMany
    {
        return $this->hasMany(PerformanceTrainingNeed::class, 'review_id');
    }

    /**
     * Recalculate overall_score using the BSC weighted formula.
     * overall_score = sum(rating × weight) / (total_weight × 5) × 100
     * This produces a percentage where A(4/5) with 100% weight = 80%.
     */
    public function recalculateScore(): void
    {
        $objectives = $this->objectives()->whereNotNull('score')->get();
        $totalWeight = $objectives->sum(fn ($o) => (float) $o->weight);
        $weightedSum = $objectives->sum(fn ($o) => (float) $o->score * (float) $o->weight);
        $score = $totalWeight > 0 ? round($weightedSum / ($totalWeight * 5) * 100, 2) : 0.00;

        $this->update(['overall_score' => $score]);
    }
}
