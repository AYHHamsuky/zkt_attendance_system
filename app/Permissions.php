<?php

namespace App;

class Permissions
{
    // ── Always granted to every authenticated user (cannot be revoked) ──────
    public const ALWAYS_GRANTED = [
        'platform.dashboard',
        'hr.leave.apply',
        'performance.appraisals',
    ];

    // ── Super-admin exclusive (not configurable for other roles) ────────────
    public const SUPER_ADMIN_ONLY = [
        'settings.access',
    ];

    // ── Full permission catalogue grouped by section ─────────────────────────
    public const GROUPS = [
        'Platform' => [
            'platform.dashboard' => 'Dashboard',
            'platform.devices' => 'Devices Management',
            'platform.employees' => 'Employee Records',
            'platform.attendance' => 'Attendance Logs',
            'platform.reports' => 'Attendance Reports',
        ],
        'HR Management' => [
            'hr.dashboard' => 'HR Dashboard',
            'hr.nominal_roll' => 'Nominal Roll',
            'hr.contracts' => 'Contracts',
            'hr.leave.apply' => 'Leave Application (own)',
            'hr.leave.manage' => 'Leave Approval',
            'hr.public_holidays' => 'Public Holidays',
            'hr.documents' => 'Documents',
            'hr.transfers' => 'Transfers',
            'hr.resignations' => 'Resignations',
        ],
        'Performance' => [
            'performance.cycles' => 'Appraisal Cycles & Reviews',
            'performance.reports' => 'Performance Reports',
            'performance.appraisals' => 'My Appraisals (own)',
        ],
        'Settings' => [
            'settings.users' => 'User Management',
        ],
    ];

    // ── Default permissions seeded per role ──────────────────────────────────
    public const DEFAULTS = [
        'admin' => [
            'platform.dashboard', 'platform.devices', 'platform.employees',
            'platform.attendance', 'platform.reports',
            'hr.dashboard', 'hr.nominal_roll', 'hr.contracts',
            'hr.leave.apply', 'hr.leave.manage', 'hr.public_holidays',
            'hr.documents', 'hr.transfers', 'hr.resignations',
            'performance.cycles', 'performance.reports', 'performance.appraisals',
            'settings.users',
        ],
        'hr' => [
            'platform.dashboard',
            'hr.dashboard', 'hr.contracts',
            'hr.leave.apply', 'hr.leave.manage', 'hr.public_holidays',
            'hr.documents', 'hr.transfers', 'hr.resignations',
            'performance.cycles', 'performance.reports', 'performance.appraisals',
        ],
        'user' => [
            'platform.dashboard',
            'hr.leave.apply',
            'performance.appraisals',
        ],
    ];

    /** Return every known permission key. */
    public static function all(): array
    {
        return array_merge(...array_values(array_map('array_keys', self::GROUPS)));
    }
}
