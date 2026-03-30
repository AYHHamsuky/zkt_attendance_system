<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformanceTemplateItem extends Model
{
    protected $fillable = [
        'template_id', 'bsc_category', 'serial',
        'objective', 'kpi', 'weight', 'target', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'weight' => 'float',
            'serial' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(PerformanceTemplate::class, 'template_id');
    }
}
