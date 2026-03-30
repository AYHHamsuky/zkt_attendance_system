<?php

namespace App\Observers;

use App\Models\HrAuditLog;
use App\Models\HrProfile;

class HrProfileObserver
{
    /** Human-readable labels for tracked fields. */
    private const FIELD_LABELS = [
        'payroll_id' => 'Payroll ID',
        'title' => 'Title',
        'first_name' => 'First Name',
        'middle_name' => 'Middle Name',
        'last_name' => 'Last Name',
        'job_grade' => 'Job Grade',
        'job_level' => 'Job Level',
        'division' => 'Division',
        'line_manager_name' => 'Line Manager',
        'line_manager_phone' => 'Line Manager Phone',
        'start_date' => 'Start Date',
        'date_of_confirmation' => 'Confirmation Date',
        'marital_status' => 'Marital Status',
        'date_of_birth' => 'Date of Birth',
        'gender' => 'Gender',
        'state_of_origin' => 'State of Origin',
        'lga' => 'LGA',
        'nationality' => 'Nationality',
        'religion' => 'Religion',
        'home_address' => 'Home Address',
        'next_of_kin_name' => 'Next of Kin',
        'next_of_kin_relationship' => 'Next of Kin Relationship',
        'next_of_kin_phone' => 'Next of Kin Phone',
        'highest_qualification' => 'Highest Qualification',
        'institution' => 'Institution',
        'course_of_study' => 'Course of Study',
        'grade_level' => 'Grade Level',
        'step' => 'Step',
        'pensionable' => 'Pensionable',
        'reports_to_employee_id' => 'Reports To',
    ];

    public function updated(HrProfile $profile): void
    {
        $dirty = $profile->getDirty();

        // Exclude system / import fields from audit
        $ignored = ['updated_at', 'created_at'];
        $changes = [];

        foreach ($dirty as $field => $newValue) {
            if (in_array($field, $ignored, true)) {
                continue;
            }

            $oldValue = $profile->getOriginal($field);

            if ($oldValue === $newValue) {
                continue;
            }

            $changes[] = [
                'field' => $field,
                'label' => self::FIELD_LABELS[$field] ?? ucwords(str_replace('_', ' ', $field)),
                'old' => $oldValue,
                'new' => $newValue,
            ];
        }

        if (! empty($changes)) {
            HrAuditLog::create([
                'employee_id' => $profile->employee_id,
                'user_id' => auth()->id(),
                'changes' => $changes,
            ]);
        }
    }
}
