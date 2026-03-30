<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class PublicHoliday extends Model
{
    protected $fillable = ['name', 'date', 'description'];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
        ];
    }

    /** Holidays within a date range that fall on weekdays (Mon–Fri). */
    public static function between(Carbon $start, Carbon $end): Collection
    {
        return static::query()
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->orderBy('date')
            ->get(['id', 'name', 'date'])
            ->filter(fn ($h) => ! in_array($h->date->dayOfWeek, [0, 6])) // exclude Sun, Sat
            ->values();
    }

    /** Count weekday holidays in a date range. */
    public static function countBetween(Carbon $start, Carbon $end): int
    {
        return static::between($start, $end)->count();
    }

    public function scopeForYear(Builder $query, int $year): Builder
    {
        return $query->whereYear('date', $year);
    }
}
