<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformanceTrainingNeed extends Model
{
    protected $fillable = [
        'review_id',
        'name',
        'skill_gap',
        'training_type',
        'priority',
        'target_date',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'target_date' => 'date',
        ];
    }

    public function review(): BelongsTo
    {
        return $this->belongsTo(PerformanceReview::class, 'review_id');
    }
}
