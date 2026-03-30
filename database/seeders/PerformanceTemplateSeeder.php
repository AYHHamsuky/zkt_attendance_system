<?php

namespace Database\Seeders;

use App\Models\PerformanceTemplate;
use App\Models\PerformanceTemplateItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class PerformanceTemplateSeeder extends Seeder
{
    /** BSC items for the default HR template (sourced from the official appraisal form). */
    private const DEFAULT_ITEMS = [
        // Financials
        ['bsc_category' => 'Financials', 'serial' => 1, 'objective' => 'Attrition rate', 'kpi' => '% Reduction rate from Previous year', 'weight' => 20, 'target' => '90%', 'sort_order' => 1],
        ['bsc_category' => 'Financials', 'serial' => 2, 'objective' => 'Alternative Resourcing', 'kpi' => 'Number of KIV used', 'weight' => 10, 'target' => '10', 'sort_order' => 2],
        ['bsc_category' => 'Financials', 'serial' => 3, 'objective' => 'Employee Engagement', 'kpi' => 'Not Less than 8 sessions Facilitated in a year', 'weight' => 10, 'target' => '8', 'sort_order' => 3],
        // Customers
        ['bsc_category' => 'Customers', 'serial' => 1, 'objective' => 'Improve internal Service delivery', 'kpi' => 'Internal customer satisfaction', 'weight' => 10, 'target' => '90%', 'sort_order' => 4],
        ['bsc_category' => 'Customers', 'serial' => 2, 'objective' => 'Conflict Resolution', 'kpi' => 'Total resolution', 'weight' => 10, 'target' => '100%', 'sort_order' => 5],
        // Internal Process
        ['bsc_category' => 'Internal Process', 'serial' => 1, 'objective' => 'Develop/Implement HR policies', 'kpi' => 'Compliance to policies', 'weight' => 5, 'target' => '100%', 'sort_order' => 6],
        ['bsc_category' => 'Internal Process', 'serial' => 2, 'objective' => 'Recruitment Process', 'kpi' => 'Employ Sales Representative to fill in the gap created', 'weight' => 5, 'target' => '100', 'sort_order' => 7],
        // Learning & Growth
        ['bsc_category' => 'Learning & Growth', 'serial' => 1, 'objective' => 'Employees training', 'kpi' => 'Training Participation', 'weight' => 10, 'target' => '100%', 'sort_order' => 8],
        ['bsc_category' => 'Learning & Growth', 'serial' => 2, 'objective' => 'Facilitate knowledge sharing session', 'kpi' => 'Not less than 6 in a year organisation wide', 'weight' => 10, 'target' => '6', 'sort_order' => 9],
        // Core Values
        ['bsc_category' => 'Core Values', 'serial' => 1, 'objective' => 'Team Work', 'kpi' => 'Respects diversity of individuals and thoughts. Works as a part of the cohesive team.', 'weight' => 2, 'target' => '100%', 'sort_order' => 10],
        ['bsc_category' => 'Core Values', 'serial' => 2, 'objective' => 'Integrity', 'kpi' => 'Conducts his/her business fairly and honestly. Ethical while dealing (serving) any stakeholder.', 'weight' => 4, 'target' => '100%', 'sort_order' => 11],
        ['bsc_category' => 'Core Values', 'serial' => 3, 'objective' => 'Excellence', 'kpi' => 'Achieves the highest possible standards of work. Embraces change and faces challenges boldly & intelligently.', 'weight' => 2, 'target' => '100%', 'sort_order' => 12],
        ['bsc_category' => 'Core Values', 'serial' => 4, 'objective' => 'Sustainability', 'kpi' => 'Continuously thrives for improvements in his/her assigned work/processes. Looks for creative & breakthrough solution to problems.', 'weight' => 2, 'target' => '100%', 'sort_order' => 13],
    ];

    public function run(): void
    {
        // Skip if templates already exist
        if (PerformanceTemplate::exists()) {
            return;
        }

        $superAdmin = User::where('role', 'super_admin')->first()
            ?? User::where('role', 'admin')->first()
            ?? User::first();

        if (! $superAdmin) {
            return;
        }

        $template = PerformanceTemplate::create([
            'name' => 'Standard HR BSC Template',
            'position' => null, // Generic — applies to all positions by default
            'description' => 'Default Balanced Scorecard appraisal template used across all HR positions.',
            'is_active' => true,
            'created_by' => $superAdmin->id,
        ]);

        foreach (self::DEFAULT_ITEMS as $item) {
            PerformanceTemplateItem::create(array_merge($item, ['template_id' => $template->id]));
        }
    }
}
