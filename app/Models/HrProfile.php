<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class HrProfile extends Model
{
    use Searchable;

    public function toSearchableArray(): array
    {
        return [
            'payroll_id' => $this->payroll_id,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'job_grade' => $this->job_grade,
            'job_level' => $this->job_level,
            'division' => $this->division,
            'title' => $this->title,
        ];
    }

    protected $fillable = [
        'employee_id',
        'reports_to_employee_id',
        'payroll_id',
        'title',
        'first_name',
        'middle_name',
        'last_name',
        'job_grade',
        'job_level',
        'division',
        'line_manager_name',
        'line_manager_phone',
        'line_manager_email',
        'start_date',
        'date_of_confirmation',
        'marital_status',
        'date_of_birth',
        'gender',
        'state_of_origin',
        'lga',
        'nationality',
        'religion',
        'home_address',
        'next_of_kin_name',
        'next_of_kin_relationship',
        'next_of_kin_phone',
        'next_of_kin_address',
        'highest_qualification',
        'institution',
        'course_of_study',
        'grade_level',
        'step',
        'pensionable',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'date_of_confirmation' => 'date',
            'date_of_birth' => 'date',
            'pensionable' => 'boolean',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /** The employee this person reports to. */
    public function reportsTo(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'reports_to_employee_id');
    }

    /** Employees who report directly to this employee (via their hr_profile). */
    public function directReports(): HasMany
    {
        return $this->hasMany(self::class, 'reports_to_employee_id', 'employee_id');
    }
}
