<?php

namespace App\Observers;

use App\Models\Employee;
use App\Models\HrAuditLog;

class EmployeeObserver
{
    /** Human-readable labels for tracked Employee fields. */
    private const FIELD_LABELS = [
        'name' => 'Full Name',
        'email' => 'Email',
        'phone' => 'Phone',
        'department' => 'Department',
        'unit' => 'Unit',
        'position' => 'Position',
        'location' => 'Location',
        'region' => 'Region',
        'is_active' => 'Active Status',
        'photo_path' => 'Profile Photo',
    ];

    public function updated(Employee $employee): void
    {
        $dirty = $employee->getDirty();
        $ignored = ['updated_at', 'created_at'];
        $changes = [];

        foreach ($dirty as $field => $newValue) {
            if (in_array($field, $ignored, true) || ! array_key_exists($field, self::FIELD_LABELS)) {
                continue;
            }

            $oldValue = $employee->getOriginal($field);

            if ($oldValue === $newValue) {
                continue;
            }

            // Show a friendly value for the photo path instead of the raw storage path
            if ($field === 'photo_path') {
                $oldValue = $oldValue ? 'Photo uploaded' : '(none)';
                $newValue = $newValue ? 'Photo uploaded' : '(none)';
            }

            // Show boolean as Yes/No
            if ($field === 'is_active') {
                $oldValue = $oldValue ? 'Active' : 'Inactive';
                $newValue = $newValue ? 'Active' : 'Inactive';
            }

            $changes[] = [
                'field' => $field,
                'label' => self::FIELD_LABELS[$field],
                'old' => $oldValue,
                'new' => $newValue,
            ];
        }

        if (! empty($changes)) {
            HrAuditLog::create([
                'employee_id' => $employee->id,
                'user_id' => auth()->id(),
                'changes' => $changes,
            ]);
        }
    }
}
